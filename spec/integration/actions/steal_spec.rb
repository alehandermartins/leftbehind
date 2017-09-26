describe 'Steal' do

  let(:game_id){'deadbeef'}

  let(:player_hash){
    {
      'name' => 'player_name',
      'uuid' => 'player'
    }
  }

  let(:otter_player_hash){
    {
      'name' => 'otter_player_name',
      'uuid' => 'otter'
    }
  }

  let(:anotter_player_hash){
    {
      'name' => 'anotter_player_name',
      'uuid' => 'anotter'
    }
  }

  let(:steal_otter){
    {
      'morning' => {
        'name' => 'steal',
        'payload' => {
          'target' => 'otter',
          'resource' => 'food'
        }
      }
    }
  }

  let(:search_infirmary){
    {
      'morning' => {
        'name' => 'search',
        'payload' => {
          'location' => '4',
        }
      }
    }
  }

  before(:each){

    db['games'].insert_one({
      name: 'test_game',
      uuid: game_id
    })

    Services::Games.add_player game_id, player_hash['uuid'], player_hash['name']
    Services::Games.add_player game_id, otter_player_hash['uuid'], otter_player_hash['name']
    Services::Games.add_player game_id, anotter_player_hash['uuid'], anotter_player_hash['name']
  }

  describe 'Alone players' do

    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], steal_otter
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], search_infirmary

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']

      @one_action = @initial_context.slots[1].actions.first
      @otter_action = @initial_context.slots[1].actions.last
      @initial_context.locations['4'][:inventory][:food] = 0
    }

    it 'steals if target has something' do
      @otter.inventory.add :food, 2
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context

      expect(@player.inventory[:food]).to eq(1)
      expect(@otter.inventory[:food]).to eq(1)
    end

    it 'fails if target has nothing' do
      @otter.inventory.add :food, 0
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context

      expect(@player.inventory[:food]).to eq(0)
      expect(@otter.inventory[:food]).to eq(0)
      expect(@one_action.status).to eq(:fail)
      expect(@one_action.info).to eq(reason: 'action.steal.result.empty')
    end
  end

  describe 'Multiple players' do

    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], steal_otter
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], search_infirmary
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], steal_otter

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @anotter = @initial_context.players['anotter']

      @one_action = @initial_context.slots[1].actions.first
      @otter_action = @initial_context.slots[1].actions[1]
      @anotter_action = @initial_context.slots[1].actions.last
    }

    it 'handles cooperative situations' do
      derived_context = @one_action.run @initial_context
      derived_context = @anotter_action.run derived_context

      expect(@anotter_action).not_to receive(:run_multiple)
    end

    it 'distributes the stolen resources correctly' do
      @otter.inventory.add :food, 2
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(@player.inventory[:food]).to eq(1)
      expect(@anotter.inventory[:food]).to eq(1)
    end

    it 'only successful for one if no more resources' do
      @otter.inventory.add :food, 1

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(@player.inventory[:food]).to eq(0)
      expect(@anotter.inventory[:food]).to eq(1)
      expect(@otter.inventory[:food]).to eq(0)
      expect(@one_action.status).to eq(:fail)
      expect(@anotter_action.status).to eq(:success)
      expect(@one_action.info).to eq(reason: 'action.steal.result.empty')
      expect(@player.information['player'][1][:result][:info]).to eq(reason: 'action.steal.result.empty')
    end

    it 'fails if target left behind' do
      @player.escape

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(@player.inventory[:food]).to eq(0)
      expect(@otter.inventory[:food]).to eq(0)
      expect(@one_action.status).to eq(:fail)
      expect(@anotter_action.status).to eq(:fail)
      expect(@player.information['player'][1][:result][:info]).to eq(reason: 'action.escape.result.you_left')
      expect(@anotter.information['anotter'][1][:result][:info]).to eq(reason: 'action.steal.result.empty')
    end

    it 'fails if player left behind and target escaped' do
      @otter.escape

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(@player.inventory[:food]).to eq(0)
      expect(@otter.inventory[:food]).to eq(0)
      expect(@one_action.status).to eq(:fail)
      expect(@anotter_action.status).to eq(:fail)
      expect(@player.information['player'][1][:result][:info]).to eq(reason: 'action.escape.result.target_left')
      expect(@anotter.information['anotter'][1][:result][:info]).to eq(reason: 'action.escape.result.target_left')
    end
  end
end
