describe ActionsController do

  let(:join_game_route){'/games/join'}
  let(:sample_player_uuid){'3c61cf77-32b0-4df2-9376-0960e64a654a'}
  let(:otter_player_uuid){'3c61cf77-32b0-4df2-9376-0960e64a654b'}
  let(:chosen_actions){
    {
      'morning' => {
        name: 'search',
        payload: {
          location: '2'
        }
      },
      'afternoon' => {
        name: 'search',
        payload: {
          location: '2'
        }
      },
      'evening' => {
        name: 'search',
        payload: {
          location: '2'
        }
      },
      'midnight' => {
        name: 'work',
        payload: {
          item: 'escape shuttle'
        }
      }
    }
  }

  let(:sample_sharing){
    {
      'sharing' => {
        name: 'share',
        payload: {
          'team' => {
            food:2,
            parts: 1,
          }
        }
      }
    }
  }

  let(:sample_voting){
    {
      'voting' => {
        name: 'vote',
        payload: {
          target: [otter_player_uuid]
        }
      }
    }
  }

  let(:day_actions){chosen_actions.merge(sample_sharing).merge(sample_voting)}

  before(:each) do
    post '/games/create', {
      name: 'sample_game_name',
      player:{
        name: 'sample_player_name',
        uuid: sample_player_uuid
      },
      type: 'public'
    }
    @sample_game_uuid = parsed_response['uuid']
  end

  describe 'send-selected' do
    it 'can receive selected actions' do
      post '/actions/send-selected', {
        actions: chosen_actions,
        game_uuid: @sample_game_uuid,
        player_uuid: sample_player_uuid
      }

      expect(last_response.ok?).to be true
      expect(parsed_response['status']).to eq 'success'
    end

    it 'fails when no actions selected' do
      post '/actions/send-selected', {
        game_uuid: @sample_game_uuid,
        player_uuid: sample_player_uuid
      }

      expect(parsed_response['status']).to eq 'fail'
    end
  end

  xdescribe 'get-stats' do
    it 'recovers the initial stats when there are no computed actions yet' do

      post '/games/get-stats', {
        game_uuid: @sample_game_uuid,
        player_uuid: sample_player_uuid
      }

      expect(last_response.ok?).to be true
      expect(parsed_response['status']).to eq 'success'
      stats = parsed_response['stats']
      expect(stats['escape_shuttle']).to eq(10)
      expect(stats['personal']).to eq({"food" => 0, "parts" => 0})
      expect(stats['team']).to eq({"food" => 0, "parts" => 0})
    end

    xit 'recovers the correct fix amount after computing actions' do
      post '/games/join',{
        uuid: @sample_game_uuid,
        player:{
          name: 'otter_player_name',
          uuid: otter_player_uuid
        }
      }

      post '/actions/send-selected', {
        actions: chosen_actions,
        game_uuid: @sample_game_uuid,
        player_uuid: sample_player_uuid
      }

      post '/actions/send-selected', {
        actions: chosen_actions,
        game_uuid: @sample_game_uuid,
        player_uuid: otter_player_uuid
      }

      post '/games/get-stats', {
        game_uuid: @sample_game_uuid,
        player_uuid: sample_player_uuid
      }

      expect(last_response.ok?).to be true
      expect(parsed_response['status']).to eq 'success'
      stats = parsed_response['stats']
      expect(stats['escape_shuttle']).to eq(8)
    end
  end
end
