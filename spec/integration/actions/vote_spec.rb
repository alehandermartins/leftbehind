describe 'Vote' do

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

  let(:vote_one){
    {
      'events' => {
        'name' => 'vote',
        'payload' => {
          'target' => ['otter']
        }
      }
    }
  }

  let(:vote_two){
    {
      'events' => {
        'name' => 'vote',
        'payload' => {
          'target' => ['otter']
        }
      }
    }
  }

  let(:dead_vote){
    {
      'events' => {
        name: 'playdead',
        payload: {
          label: 'Dead'
        }
      }
    }
  }

  let(:multiple_vote_one){
    {
      'events' => {
        'name' => 'vote',
        'payload' => {
          'target' => ['otter', 'anotter']
        }
      }
    }
  }

  let(:multiple_vote_two){
    {
      'events' => {
        'name' => 'vote',
        'payload' => {
          'target' => ['otter', 'player']
        }
      }
    }
  }

  let(:multiple_vote_three){
    {
      'events' => {
        'name' => 'vote',
        'payload' => {
          'target' => ['otter', 'player']
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

  describe 'One Winner' do

    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], vote_one
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], vote_two
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], dead_vote

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @anotter = @initial_context.players['anotter']

      @one_action = @initial_context.slots[5].actions.first
      @otter_action = @initial_context.slots[5].actions[1]
      @anotter_action = @initial_context.slots[5].actions.last
    }

    it 'only resolves once' do
      allow(@initial_context.team.inventory).to receive(:[]).with(:food).and_return(1)
      allow(@anotter).to receive(:alive?).and_return(false)

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context
      derived_context = @anotter_action.run derived_context

      derived_context = @one_action.resolve derived_context
      derived_context = @otter_action.resolve derived_context
      derived_context = @anotter_action.resolve derived_context
    end

    it 'computes the winners correctly and stores the results' do
      allow(@initial_context.team.inventory).to receive(:[]).with(:food).and_return(1)
      allow(@anotter).to receive(:alive?).and_return(false)

      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      derived_context = @otter_action.resolve derived_context
      derived_context = @one_action.resolve derived_context

      voting_results = {'player' => 0, 'otter' => 2, 'anotter' => 0}
      winners = ['otter']

      expect(derived_context.team.information[:voting][5][:result][:results]).to eq(voting_results)
      expect(derived_context.team.information[:voting][5][:result][:winners]).to eq(winners)
    end
  end

  describe 'Multiple Winners' do

    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], multiple_vote_one
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], multiple_vote_two
      Services::Actions.send :save, game_id, anotter_player_hash['uuid'], multiple_vote_three

      @initial_context = Context.build_for game_id
    }

    it 'computes the winners correctly and stores the results' do
      allow(@initial_context.team.inventory).to receive(:[]).with(:food).and_return(1)

      player = @initial_context.players['player']
      otter = @initial_context.players['otter']
      anotter = @initial_context.players['anotter']

      one_action = @initial_context.slots[5].actions.first
      otter_action = @initial_context.slots[5].actions[1]
      anotter_action = @initial_context.slots[5].actions.last

      derived_context = one_action.run @initial_context
      derived_context = otter_action.run derived_context
      derived_context = anotter_action.run derived_context

      derived_context = otter_action.resolve derived_context
      derived_context = one_action.resolve derived_context
      derived_context = anotter_action.resolve derived_context

      voting_results = {'player' => 2, 'otter' => 3, 'anotter' => 1}
      winners = ['otter', 'player']

      expect(derived_context.team.information[:voting][5][:result][:results]).to eq(voting_results)
      expect(derived_context.team.information[:voting][5][:result][:winners]).to eq(winners)
    end
  end
end
