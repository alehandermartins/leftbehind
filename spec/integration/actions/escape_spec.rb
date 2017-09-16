describe 'Escape' do

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

  let(:escape){
    {
      'morning' => {
        name: 'escape',
        payload: {
          label: 'Escape'
        }
      }
    }
  }

  let(:work){
    {
      'morning' => {
        name: 'work',
        payload: {
          item: 'escape shuttle',
          label: 'Repair the escape shuttle'
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

      Services::Actions.send :save, game_id, player_hash['uuid'], escape
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], work
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], work

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @anotter = @initial_context.players['anotter']

      @one_action = @initial_context.slots[1].actions.first
      @otter_action = @initial_context.slots[1].actions[1]
      @anotter_action = @initial_context.slots[1].actions.last
    }

    it 'cannot escape without a helmet' do
      @player.inventory.subtract :helmet, 1
      derived_context = @one_action.run @initial_context
      derived_context = @one_action.resolve derived_context

      expect(@one_action.status).to eq(:fail)
      expect(@one_action.info).to eq(reason: 'action.escape.result.helmet_needed')
    end

    it 'cannot escape if the shuttle is not fixed' do
      @player.inventory.add :helmet, 1
      derived_context = @one_action.run @initial_context
      derived_context = @one_action.resolve derived_context

      expect(@one_action.status).to eq(:fail)
      expect(@one_action.info).to eq(reason: 'action.work.result.broken_shuttle')
    end

    it 'escapes if performer has a helmet and the shuttle is fixed and traps other people' do
      allow(@initial_context.items['escape shuttle']).to receive(:[]).with(:fix).and_return(0)
      @player.inventory.add :helmet, 1
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context

      expect(@one_action.status).to eq(:success)
      expect(@player.status).to eq(:escaped)
      expect(@otter.status).to eq(:trapped)
    end
  end

  describe 'Multiple players' do

    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], escape
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], work
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], escape

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @anotter = @initial_context.players['anotter']

      @one_action = @initial_context.slots[1].actions.first
      @otter_action = @initial_context.slots[1].actions[1]
      @anotter_action = @initial_context.slots[1].actions.last
    }

    it 'traps other players without helmet' do
      allow(@initial_context.items['escape shuttle']).to receive(:[]).with(:fix).and_return(0)
      @otter.inventory.subtract :helmet, 1
      @anotter.inventory.subtract :helmet, 1
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context

      expect(@one_action.status).to eq(:success)
      expect(@player.status).to eq(:escaped)
      expect(@otter.status).to eq(:trapped)
      expect(@anotter.status).to eq(:trapped)
    end

    it 'does not trap dead players' do
      allow(@initial_context.items['escape shuttle']).to receive(:[]).with(:fix).and_return(0)
      @otter.radiate
      @anotter.inventory.subtract :helmet, 1
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context

      expect(@one_action.status).to eq(:success)
      expect(@player.status).to eq(:escaped)
      expect(@otter.status).to eq(:radiated)
      expect(@anotter.status).to eq(:trapped)
    end

    it 'escapes with other players escaping with a helmet' do
      allow(@initial_context.items['escape shuttle']).to receive(:[]).with(:fix).and_return(0)
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context

      expect(@one_action.status).to eq(:success)
      expect(@player.status).to eq(:escaped)
      expect(@otter.status).to eq(:trapped)
      expect(@anotter_action.status).to eq(:success)
      expect(@anotter.status).to eq(:escaped)
    end

     it 'makes repair actions fail' do
      allow(@initial_context.items['escape shuttle']).to receive(:[]).with(:fix).and_return(0)
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context

      expect(@one_action.status).to eq(:success)
      expect(@player.status).to eq(:escaped)
      expect(@otter.status).to eq(:trapped)
      expect(@otter_action.status).to eq(:fail)
      expect(@otter_action.info[:reason]).to eq('action.escape.result.shuttle_left')
      expect(@anotter_action.status).to eq(:success)
      expect(@anotter.status).to eq(:escaped)
    end
  end
end
