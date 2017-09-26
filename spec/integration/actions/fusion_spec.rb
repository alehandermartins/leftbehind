describe 'Fusion' do

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

  let(:fusion_enter){
    {
      'events' => {
        'name' => 'fusion',
        'payload' => {
          'enter' => 'true'
        }
      }
    }
  }

  let(:fusion_stay){
    {
      'events' => {
        'name' => 'fusion',
        'payload' => {
          'enter' => 'false'
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

  describe 'Nobody enters' do

    before(:each){
      Services::Actions.send :save, game_id, player_hash['uuid'], fusion_stay
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], fusion_stay
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], fusion_stay

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @anotter = @initial_context.players['anotter']

      @one_action = @initial_context.slots[5].actions.first
      @otter_action = @initial_context.slots[5].actions[1]
      @anotter_action = @initial_context.slots[5].actions.last
    }

    it 'kills everyone' do
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run @initial_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(derived_context.players['player'].status).to eq(:exploded)
      expect(derived_context.players['otter'].status).to eq(:exploded)
      expect(derived_context.players['anotter'].status).to eq(:exploded)

      expect(@player.information['player'][5][:result][:info]).to eq('player.status.exploded')
      expect(@player.information['otter'][5][:result][:info]).to eq('player.status.exploded')
      expect(@player.information['anotter'][5][:result][:info]).to eq('player.status.exploded')
    end
  end

  describe 'Only one player enters' do

    before(:each){
      Services::Actions.send :save, game_id, player_hash['uuid'], fusion_enter
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], fusion_stay
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], fusion_stay

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @anotter = @initial_context.players['anotter']

      @one_action = @initial_context.slots[5].actions.first
      @otter_action = @initial_context.slots[5].actions[1]
      @anotter_action = @initial_context.slots[5].actions.last
    }

    it 'kills the player if no helmet and adds event participation' do
      allow(@player.inventory).to receive(:[]).with(:helmet).and_return(0)
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run @initial_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(derived_context.players['player'].status).to eq(:radiated)
      expect(derived_context.players['otter'].status).to eq(:alive)
      expect(derived_context.players['anotter'].status).to eq(:alive)

      expect(derived_context.players['player'].events).to eq([:fusion])
      expect(derived_context.players['otter'].events).to eq([:fusion])
      expect(derived_context.players['anotter'].events).to eq([:fusion])

      expect(@player.information['player'][5][:result][:info]).to eq('player.status.radiated')
    end
  end

  describe 'More than one player enter' do

    before(:each){
      Services::Actions.send :save, game_id, player_hash['uuid'], fusion_enter
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], fusion_enter
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], fusion_stay

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @anotter = @initial_context.players['anotter']

      @one_action = @initial_context.slots[5].actions.first
      @otter_action = @initial_context.slots[5].actions[1]
      @anotter_action = @initial_context.slots[5].actions.last
    }

    it 'kills the player if no helmet and removes helmet of those who entered' do
      allow(@player.inventory).to receive(:[]).with(:helmet).and_return(0)
      @otter.inventory.add :helmet, 2

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run @initial_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(derived_context.players['player'].status).to eq(:radiated)
      expect(derived_context.players['otter'].status).to eq(:alive)
      expect(derived_context.players['otter'].inventory[:helmet]).to eq(0)
      expect(derived_context.players['anotter'].status).to eq(:alive)

      expect(@player.information['player'][5][:result][:info]).to eq('player.status.radiated')
      expect(@player.information['otter'][5][:result][:info]).to eq('action.fusion.result.entered')
    end

    it 'places helmets around the ship in unknown locations' do
      @player.information.add_to :locations, :cabins, 1
      @otter.information.add_to :locations, :cabins, 1
      @otter.information.add_to :locations, :bridge, 1

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run @initial_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(derived_context.players['player'].status).to eq(:alive)
      expect(derived_context.players['otter'].status).to eq(:alive)
      expect(derived_context.players['anotter'].status).to eq(:alive)

      expect(derived_context.players['player'].inventory[:helmet]).to eq(0)
      expect(derived_context.players['otter'].inventory[:helmet]).to eq(0)
      expect(helmets_amount derived_context).to eq(2)

      expect(@player.information['player'][5][:result][:info]).to eq('action.fusion.result.entered')
      expect(@player.information['otter'][5][:result][:info]).to eq('action.fusion.result.entered')
    end

    def helmets_amount context
      context.locations.uuids.reduce(0){ |total, location_name|
        total + context.locations[location_name][:inventory][:helmet]
      }
    end
  end
end
