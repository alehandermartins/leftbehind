describe 'Eat' do

  describe 'Multiple players' do

    before(:each){
      game_id = 'deadbeef'

      db['games'].insert_one({
        name: 'test_game',
        uuid: game_id
      })

      player_hash = {
        'name' => 'player_name',
        'uuid' => 'player'
      }

      otter_player_hash = {
        'name' => 'otter_player_name',
        'uuid' => 'otter'
      }

      anotter_player_hash = {
        'name' => 'anotter_player_name',
        'uuid' => 'anotter'
      }

      Services::Games.add_player game_id, player_hash['uuid'], player_hash['name']
      Services::Games.add_player game_id, otter_player_hash['uuid'], otter_player_hash['name']
      Services::Games.add_player game_id, anotter_player_hash['uuid'], anotter_player_hash['name']

      eat = {
        'eating' => {
          'name' => 'eat',
          'payload' => {
            'resource' => 'food'
          }
        }
      }

      Services::Actions.send :save, game_id, player_hash['uuid'], eat
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], eat
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], eat

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @anotter = @initial_context.players['anotter']

      @one_action = @initial_context.slots[6].actions.first
      @otter_action = @initial_context.slots[6].actions[1]
      @anotter_action = @initial_context.slots[6].actions.last
    }

    it 'uses players resources and kills' do
      @player.inventory.add :food, 1

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(@player.inventory[:food]).to eq(0)
      expect(@player.status).to eq(:alive)
      expect(@otter.inventory[:food]).to eq(0)
      expect(@otter.status).to eq(:dead)
      expect(@anotter.inventory[:food]).to eq(0)
      expect(@anotter.status).to eq(:dead)
      expect(derived_context.players['player'].status).to eq(:alive)
      expect(derived_context.players['otter'].status).to eq(:dead)
      expect(derived_context.players['otter'].tomb[:slot]).to eq(6)
      expect(derived_context.players['anotter'].status).to eq(:dead)
      expect(derived_context.players['anotter'].tomb[:slot]).to eq(6)
      expect(@player.information['otter'][6][:result][:info]).to eq('player.status.starved')
      expect(@player.information['anotter'][6][:result][:info]).to eq('player.status.starved')
    end

    it 'gives food to everyone if the team has plenty' do
      @initial_context.team.inventory.add :food, 3
      @player.inventory.add :food, 1
      @otter.inventory.add :food, 1
      @anotter.inventory.add :food, 2

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(derived_context.team.inventory[:food]).to eq(0)
      expect(@player.inventory[:food]).to eq(1)
      expect(@player.status).to eq(:alive)
      expect(@otter.inventory[:food]).to eq(1)
      expect(@otter.status).to eq(:alive)
      expect(@anotter.inventory[:food]).to eq(2)
      expect(@anotter.status).to eq(:alive)
      expect(derived_context.players['player'].status).to eq(:alive)
      expect(derived_context.players['otter'].status).to eq(:alive)
      expect(derived_context.players['anotter'].status).to eq(:alive)
    end

    it 'team does not give food to those who won the voting' do
      @initial_context.team.information.add_to :voting, 5, {result: {winners: ['otter', 'player']}}
      @initial_context.team.inventory.add :food, 1
      @player.inventory.add :food, 1
      @anotter.inventory.add :food, 2

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context

      expect(derived_context.team.inventory[:food]).to eq(0)
      expect(@player.inventory[:food]).to eq(0)
      expect(@player.status).to eq(:alive)
      expect(@otter.inventory[:food]).to eq(0)
      expect(@otter.status).to eq(:dead)
      expect(@anotter.inventory[:food]).to eq(2)
      expect(@anotter.status).to eq(:alive)
      expect(derived_context.players['player'].status).to eq(:alive)
      expect(derived_context.players['otter'].status).to eq(:dead)
      expect(derived_context.players['otter'].tomb[:slot]).to eq(6)
      expect(@player.information['otter'][6][:result][:info]).to eq('player.status.starved')
      expect(derived_context.players['anotter'].status).to eq(:alive)
    end
  end
end
