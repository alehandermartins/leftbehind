require 'uuid'
describe GamesController do

  let(:create_game_route){'/games/create'}
  let(:join_game_route){'/games/join'}
  let(:start_game_route){'/games/start'}
  let(:game_status_route){'/games/game_status?'}

  let(:sample_game){
    {
      name: 'sample_game_name',
      player: {
        name: 'host_player',
        uuid: '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
      },
      type: 'public'
    }
  }

  let(:other_sample_game){
    {
      name: 'some_other_game_name',
      player: {
        name: 'other_host_player',
        uuid: '36e93a52-b0f4-44f7-97a6-536d54f152e1'
      },
      type: 'private',
      password: 'password'
    }
  }

  describe 'creation' do

    it 'can create a game with a single player' do
      post create_game_route, sample_game

      expect(parsed_response['status']).to eq "success"
    end

    it 'cannot create two games with the same name' do
      post create_game_route, sample_game
      post create_game_route, sample_game

      expect(parsed_response['status']).to_not eq 'success'
    end

    it 'cannot create game with no name' do
      post create_game_route, {
        name: nil,
        player: {
          name: 'some player name',
          uuid: '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
        }
      }

      expect(parsed_response['status']).to eq 'fail'
    end

    it 'cannot create game with invalid host name' do
      post create_game_route, {
        name: sample_game[:name],
        player: {
          name: nil,
          uuid: '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
        }
      }

      expect(parsed_response['status']).to eq 'fail'
    end

    it 'cannot create game with invalid type' do
      post create_game_route, {
        name: sample_game[:name],
        player: {
          name: 'host_player',
          uuid: '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
        },
        type: nil
      }

      expect(parsed_response['status']).to eq 'fail'
      expect(parsed_response['reason']).to eq 'invalid_type'
    end

    it 'cannot create a private game with invalid password' do
      post create_game_route, {
        name: sample_game[:name],
        player: {
          name: 'host_player',
          uuid: '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
        },
        type: 'private',
        password: ''
      }

      expect(parsed_response['status']).to eq 'fail'
      expect(parsed_response['reason']).to eq 'invalid_password'
    end

    it 'returns created game uuid' do
      post create_game_route, sample_game

      created_game_uuid = parsed_response['uuid']
      expect(parsed_response['status']).to eq 'success'
      expect(UUID.validate created_game_uuid).to be true
    end

  end

  describe 'joining' do

    before(:each) do
      post create_game_route, sample_game
      @created_game_uuid = parsed_response['uuid']
    end

    it 'a player can join a game' do
      post join_game_route, {
        uuid: @created_game_uuid,
        player: {
          name: 'some player name',
          uuid: '36e93a52-b0f4-44f7-97a6-534f3d2152e2'
        }
      }

      expect(parsed_response['status']).to eq 'success'
    end

    it 'only if it exists' do
      post join_game_route, {
        uuid: '36e93a52-b0f4-44f7-97a6-59953d2152e1',
        player: {
          name: 'some player name',
          uuid: :non_existing_game_uuid
        }
      }

      expect(parsed_response['status']).to eq 'fail'
      expect(parsed_response['reason']).to eq 'invalid_game_uuid'
    end

    it 'to a game with repeated name is not possible' do
      post join_game_route, {
        uuid: @created_game_uuid,
        player: {
          name: sample_game[:player][:name],
          uuid: 'random_uuid'
        }
      }

      expect(parsed_response['status']).to eq 'fail'
      expect(parsed_response['reason']).to eq 'invalid_player_name'
    end

    it 'to a full game is not possible' do
      stub_const("Services::Games::MAXIMUM_PLAYERS", 1)

      post join_game_route, {
        uuid: @created_game_uuid,
        player: {
          name: sample_game[:player][:name],
          uuid: 'random_uuid'
        }
      }

      expect(parsed_response['status']).to eq 'fail'
      expect(parsed_response['reason']).to eq 'game_full'
    end

    it 'player name must be valid' do
      post join_game_route, {
        uuid: @created_game_uuid,
        player: {
          name: nil,
          uuid: '36e93a52-b0f4-44f7-98a6-534f3d2152e1'
        }
      }

      expect(parsed_response['status']).to eq 'fail'
      expect(parsed_response['reason']).to eq 'invalid_player_name'
    end

    it 'same person cannot join a game more than once' do
      player_uuid = '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
      post join_game_route, {
        uuid: @created_game_uuid,
        player:{
          name: 'some name',
          uuid: player_uuid
       }
      }

      post join_game_route, {
        uuid: @created_game_uuid,
        player:{
          name: 'other name',
          uuid: player_uuid
       }
      }

      expect(parsed_response['status']).to eq 'fail'
      expect(parsed_response['reason']).to eq 'already_in_this_game'
    end

    xit 'to a started game is not possible' do
      post join_game_route, {
        uuid: @created_game_uuid,
        player:{
          name: 'player name',
          uuid: :player_uuid
       }
      }
      expect(parsed_response['status']).to eq('success')

      post '/actions/send-selected', {
        actions: {
          'morning' => { name: :any_action_name },
          'afternoon' => { name: :any_action_name },
          'evening' => { name: :any_action_name },
          'midnight' => { name: :any_action_name }
        },
        game_uuid: @created_game_uuid,
        player_uuid: :player_uuid
      }
      expect(parsed_response['status']).to eq('success')

      post join_game_route, {
        uuid: @created_game_uuid,
        player:{
          name: 'other name',
          uuid: :ottter_player_uuid
       }
      }
      expect(parsed_response['status']).to eq('fail')
      expect(parsed_response['reason']).to eq('game_already_started')
    end
  end

  describe 'available' do
    it 'gets empty list when no ongoing games' do
      post '/games/available'

      expect(parsed_response).to eq []
    end

    xit 'gets list of not started games' do
      post create_game_route, sample_game
      post create_game_route, other_sample_game
      created_game_uuid = parsed_response['uuid']

      post join_game_route, {
        uuid: created_game_uuid,
        player:{
          name: 'player name',
          uuid: :player_uuid
       }
      }
      expect(parsed_response['status']).to eq('success')

      post '/actions/send-selected', {
        actions: {
          'morning' => { name: :any_action_name },
          'afternoon' => { name: :any_action_name },
          'evening' => { name: :any_action_name },
          'midnight' => { name: :any_action_name }
        },
        game_uuid: created_game_uuid,
        player_uuid: :player_uuid
      }
      expect(parsed_response['status']).to eq('success')

      post '/games/available'

      expect(parsed_response.length).to eq 1
    end
  end

  describe 'ongoing' do
    it 'gets empty list when user has no ongoing games' do
      post '/games/ongoing', {
        player_uuid: sample_game[:player][:uuid]
      }

      expect(parsed_response).to eq []
    end

    it 'gets list of user ongoing games' do
      post create_game_route, sample_game
      post create_game_route, other_sample_game

      post '/games/ongoing', {
        player_uuid: sample_game[:player][:uuid]
      }

      expect(parsed_response.length).to eq 1
    end
  end

  describe 'start' do

    before(:each) do
      post create_game_route, sample_game
      @created_game_uuid = parsed_response['uuid']
    end

     it 'fails if the game does not exist' do
      post start_game_route, {
        uuid: 'otter',
        player: '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
      }
      expect(parsed_response["status"]).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_game_uuid')
    end

    it 'fails if there are not enough players' do
      post start_game_route, {
        uuid: @created_game_uuid,
        player: '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
      }
      expect(parsed_response["status"]).to eq('fail')
      expect(parsed_response['reason']).to eq('Not enough players')
    end

    it 'fails if the host is not issuing the order' do
      stub_const("Services::Games::MINIMUM_NEEDED_PLAYERS", 1)
      post start_game_route, {
        uuid: @created_game_uuid,
        player: 'otter'
      }
      expect(parsed_response["status"]).to eq('fail')
      expect(parsed_response['reason']).to eq('wrong_host')
    end

    it 'starts the game' do
      stub_const("Services::Games::MINIMUM_NEEDED_PLAYERS", 1)
      post start_game_route, {
        uuid: @created_game_uuid,
        player: '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
      }
      expect(parsed_response["status"]).to eq('success')
    end
  end

  describe 'game_status?' do

    before(:each) do
      post create_game_route, sample_game
      @created_game_uuid = parsed_response['uuid']
    end

     it 'fails if the game does not exist' do
      post game_status_route, {
        uuid: 'otter',
      }
      expect(parsed_response["status"]).to eq('fail')
      expect(parsed_response['reason']).to eq('invalid_game_uuid')
    end

    it 'returns ready if not started' do
      post game_status_route, {
        uuid: @created_game_uuid,
      }
      expect(parsed_response["status"]).to eq('success')
      expect(parsed_response['game_status']).to eq('ready')
    end

    it 'returns ongoing if started' do
      stub_const("Services::Games::MINIMUM_NEEDED_PLAYERS", 1)
      post start_game_route, {
        uuid: @created_game_uuid,
        player: '36e93a52-b0f4-44f7-97a6-534f3d2152e1'
      }
      post game_status_route, {
        uuid: @created_game_uuid,
      }
      expect(parsed_response["status"]).to eq('success')
      expect(parsed_response['game_status']).to eq('ongoing')
    end
  end

  describe 'ready' do
    it 'fails when there are not enough players or the game does not exist' do
      post create_game_route, sample_game

      post '/games/ready',{
        uuid: @created_game_uuid,
        player: {
          name: nil,
          uuid: '36e93a52-b0f4-44f7-98a6-534f3d2152e1'
        }
      }

      expect(parsed_response["status"]).to eq('fail')
    end

    it 'is succesful when the game is ready' do
      a_number_of_players = 3
      stub_const("Services::Games::MINIMUM_NEEDED_PLAYERS", a_number_of_players)

      post create_game_route, sample_game

      game_uuid = parsed_response["uuid"]

      post '/games/join', {
        uuid: game_uuid,
        player: {
          name: 'second_player',
          uuid: '36e93a52-b0f4-44f7-97a6-5346546542e1'
        }
      }
      post '/games/join', {
        uuid: game_uuid,
        player: {
          name: 'third_player',
          uuid: '36e93a52-b0f4-44f7-97a6-5343212152e1'
        }
      }

      post '/games/ready',{
        uuid: game_uuid,
        player: {
          name: nil,
          uuid: '36e93a52-b0f4-44f7-98a6-534f3d2152e1'
        }
      }

      expect(parsed_response["status"]).to eq('success')
    end
  end

  describe 'team-mates' do
    before(:each){
      post create_game_route, sample_game
      @sample_game_uuid = parsed_response["uuid"]
    }

    it 'gets empty list when no team-mates' do

      post '/games/team-mates', {
        game_uuid: @sample_game_uuid,
        player_uuid: sample_game[:player][:uuid],
      }

      expect(parsed_response).to eq []
    end

    it 'gets list of team-mates' do
      post join_game_route, {
        uuid: @sample_game_uuid,
        player: {
          name: 'guest_player',
          uuid: 'guest_player_uuid'
        }
      }

      post '/games/team-mates', {
        game_uuid: @sample_game_uuid,
        player_uuid: 'guest_player_uuid'
      }

      expect(parsed_response.length).to eq 1
    end
  end

  describe 'players' do
    before(:each){
      post create_game_route, sample_game
      @sample_game_uuid = parsed_response["uuid"]
    }

    it 'gets only the player when he is alone' do

      post '/games/players', {
        game_uuid: @sample_game_uuid,
        player_uuid: sample_game[:player][:uuid],
      }

      expect(parsed_response.length).to eq 1
    end

    it 'gets list of players' do
      post join_game_route, {
        uuid: @sample_game_uuid,
        player: {
          name: 'guest_player',
          uuid: 'guest_player_uuid'
        }
      }

      post '/games/players', {
        game_uuid: @sample_game_uuid,
        player_uuid: 'guest_player_uuid'
      }

      expect(parsed_response.length).to eq 2
    end
  end
end
