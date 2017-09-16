describe 'Search' do

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

  let(:search_cabins){
    {
      'morning' => {
        name:'search',
        payload: {
          location: '2'
        }
      }
    }
  }

  let(:search_infirmary){
    {
      'morning' => {
        name:'search',
        payload: {
          location: '4'
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
  }

  describe 'Alone players' do

    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], search_cabins
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], search_infirmary

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']

      @one_action = @initial_context.slots[1].actions.first
      @otter_action = @initial_context.slots[1].actions.last
    }

    it 'receive their bounties as usual' do
      allow(@initial_context.locations['2']).to receive(:[]).with(:inventory).and_return({ food: 1 })
      allow(@initial_context.locations['4']).to receive(:[]).with(:inventory).and_return({ food: 1 })

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context

      expect(derived_context.team.inventory[:food]).to eq 0
      expect(@player.inventory[:food]).to eq 1
      expect(@otter.inventory[:food]).to eq 1

      expect(@one_action.bounty[:food]).to eq 1
      expect(@otter_action.bounty[:food]).to eq 1
    end

    it 'does not subtract if empty location and adds information' do
      allow(@initial_context.locations['2']).to receive(:[]).with(:inventory).and_return({ food: 0 })

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context

      expect(derived_context.team.inventory[:food]).to eq 0
      expect(@player.inventory[:food]).to eq 0
      expect(@otter.inventory[:food]).to eq 1

      expect(@one_action.bounty[:food]).to eq 0
      expect(@otter_action.bounty[:food]).to eq 1
      expect(@player.information[:locations]).to eq('2' => 1)
      expect(@one_action.status).to eq(:success)
      expect(@otter_action.status).to eq(:success)
    end
  end

  describe 'Cooperative Search' do

    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], search_cabins
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], search_cabins

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']

      @one_action = @initial_context.slots[1].actions.first
      @otter_action = @initial_context.slots[1].actions.last
    }

    it 'handles cooperative situations' do
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      expect(@otter_action).not_to receive(:run_multiple)
    end

    it 'computes all actions in the same slot' do
      expect(@one_action).to receive(:run_multiple).and_call_original
      expect(@one_action).to receive(:add_status).at_least(:once)
      expect(@otter_action).to receive(:add_status).at_least(:once)

      derived_context = @one_action.run @initial_context
      expect(derived_context.slots[1].actions).to all be_computed
    end

    it 'adds found items to team inventory' do
      allow(@initial_context.locations['2']).to receive(:[]).with(:inventory).and_return({ food: 2 })
      location = @initial_context.locations['2']

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context

      expect(@player.inventory[:food]).to eq 0
      expect(@otter.inventory[:food]).to eq 0
      expect(location[:inventory][:food]).to eq 0
      expect(derived_context.team.inventory[:food]).to eq 2

      expect(@one_action.bounty[:food]).to eq 2
      expect(@otter_action.bounty[:food]).to eq 2

      expect(@one_action.info).to eq(mates: ['player', 'otter'])
    end

    it 'adds information of empty location if empty when searching' do
      allow(@initial_context.locations['2']).to receive(:[]).with(:inventory).and_return({ food: 1 })
      location = @initial_context.locations['2']

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context

      expect(@player.inventory[:food]).to eq 0
      expect(@otter.inventory[:food]).to eq 0
      expect(location[:inventory][:food]).to eq 0
      expect(derived_context.team.inventory[:food]).to eq 1

      expect(@one_action.bounty[:food]).to eq 1
      expect(@otter_action.bounty[:food]).to eq 1

      expect(@one_action.info).to eq(mates: ['player', 'otter'])
      expect(@player.information[:locations]).to eq('2' => 1)
      expect(@otter.information[:locations]).to eq('2' => 1)
      expect(@one_action.status).to eq(:success)
      expect(@otter_action.status).to eq(:success)
    end

    it 'lets other coworkers know who found a helmet' do
      allow(@initial_context.locations['2']).to receive(:[]).with(:inventory).and_return({ helmet: 1})

      location = @initial_context.locations['2']

      derived_context = @otter_action.run @initial_context
      derived_context = @one_action.run @initial_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context

      expect(@otter.inventory[:helmet]).to eq 1
      expect(@player.inventory[:helmet]).to eq 2
      expect(location[:inventory][:helmet]).to eq 0
      expect(@player.information[@player.uuid][1][:result][:info]['player']).to eq(:helmet)
      expect(@otter.information[@player.uuid][1][:result][:info]['player']).to eq(:helmet)
    end
  end
end
