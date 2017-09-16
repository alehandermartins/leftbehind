describe 'Share' do

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

  let(:sharing_one){
    {
      'morning' => {
        name: 'share',
        payload: {
          target: 'otter',
          resource: 'food'
        }
      }
    }
  }

  let(:sharing_two) {
    {
      'morning' => {
        name: 'share',
        payload: {
          target: 'player',
          resource: 'parts'
        }
      }
    }
  }

  let(:sharing_three) {
    {
      'morning' => {
        name: 'share',
        payload: {
          target: 'team',
          resource: 'food'
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

  describe 'Resolving the transfers' do

    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], sharing_one
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], sharing_two
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], sharing_three

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @anotter = @initial_context.players['anotter']

      @one_action = @initial_context.slots[1].actions.first
      @otter_action = @initial_context.slots[1].actions[1]
      @anotter_action = @initial_context.slots[1].actions.last

      @team = @initial_context.team
    }

    it 'manages correctly the transferred goods' do
      @player.inventory.add :food, 1
      @otter.inventory.add :parts, 1
      @anotter.inventory.add :food, 1

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(@player.inventory[:food]).to eq(0)
      expect(@player.inventory[:parts]).to eq(1)
      expect(@otter.inventory[:food]).to eq(1)
      expect(@otter.inventory[:parts]).to eq(0)
      expect(@anotter.inventory[:food]).to eq(0)
      expect(@anotter.inventory[:parts]).to eq(0)
      expect(@team.inventory[:food]).to eq(1)
      expect(@team.inventory[:parts]).to eq(0)

      expect(@player.information['otter'][1]).to eq(info("player", "parts"))
      expect(@player.information['anotter'][1]).to eq(info("team", "food"))
    end

    def info target, resource
      {
        action: "LB::Action::Share",
        payload: {
          target: target,
          resource: resource
        },
        result: {
          status: :success
        },
        inventory: nil
      }
    end
  end
end
