describe 'Stats' do

  let(:game_id){'deadbeef'}
  let(:game){
    {
      name: 'sample_game_name',
      uuid: game_id,
      type: 'private',
      password: 'password',
      status: 'ready',
      host: 'player',
      style: 'gentle',
      lapse: 300,
      time: 0
    }
  }

  let(:turbo_game_id){'turbo'}
  let(:turbo_game){
    {
      name: 'sample_game_name',
      uuid: turbo_game_id,
      type: 'private',
      password: 'password',
      status: 'ongoing',
      host: 'player',
      style: 'turbo',
      lapse: 300,
      time: 0
    }
  }

  let(:locations){
    [
      {
        :uuid=>"1",
        :status=>:marked
      },
      {
        :uuid=>"2",
        :status=>:locked
      },
      {
        :uuid=>"3",
        :status=>:unlocked
      },
      {
        :uuid=>"4",
        :status=>:locked
      },
      {
        :uuid=>"5",
        :status=>:unlocked
      },
      {
        :uuid=>"6",
        :status=>:marked
      },
      {
        :uuid=>"7",
        :status=>:marked
      },
      {
        :uuid=>"8",
        :status=>:locked
      }
    ]
  }

  before(:each){
    db['games'].insert_one(game)
    game.delete(:_id)

    @player_hash = {
      'name' => 'player_name',
      'uuid' => 'player'
    }

    @otter_player_hash = {
      'name' => 'otter_player_name',
      'uuid' => 'otter'
    }

    @anotter_player_hash = {
      'name' => 'anotter_player_name',
      'uuid' => 'anotter'
    }
    allow(Services::Actions).to receive(:next_phase).and_return(true)
    Services::Games.add_player game_id, @player_hash['uuid'], @player_hash['name']
    Services::Games.add_player game_id, @otter_player_hash['uuid'], @otter_player_hash['name']
    Services::Games.add_player game_id, @anotter_player_hash['uuid'], @anotter_player_hash['name']

    search_cabins = {
        'name' => 'search',
        'payload' => {
          'location' => '2',
        }
      }

    search_infirmary = {
      'name' => 'search',
      'payload' => {
        'location' => '4',
      }
    }

    search_bridge = {
      'name' => 'search',
      'payload' => {
        'location' => '1',
      }
    }

    work = {
      'name' => 'work',
      'payload' => {
        'item' => 'escape shuttle'
      }
    }

    @player_actions = {
      'morning' => work,
      'afternoon' => work,
      'evening' => work,
      'midnight' => work
    }

    @otter_actions = {
      'morning' => search_cabins,
      'afternoon' => search_cabins,
      'evening' => search_infirmary,
      'midnight' => work
    }

    @anotter_actions = {
      'morning' => search_bridge,
      'afternoon' => search_bridge,
      'evening' => search_infirmary,
      'midnight' => work
    }

    @vote_one = {
      'events' => {
        'name' => 'vote',
        'payload' => {
          'target' => ['otter']
        }
      }
    }

    @vote_two = {
      'events' => {
        'name' => 'vote',
        'payload' => {
          'target' => ['player']
        }
      }
    }

    @eat = {
      'eating' => {
        'name' => 'eat',
        'payload' => {
          'resource' => 'food'
        }
      }
    }

    Services::Actions.send(:save, game_id, @player_hash['uuid'], @player_actions)
    Services::Actions.send(:save, game_id, @otter_player_hash['uuid'], @otter_actions)
    Services::Actions.send(:save, game_id, @anotter_player_hash['uuid'], @anotter_actions)
  }

  describe 'Actions' do

    it 'computes the correct stats for the actions stage' do
      game_status = Services::GameStatus.new game_id
      expect(game_status.get_stats['player'][:game_stats]).to eq(
      {
        :game => game,
        :current_slot => 4,
        :escape_shuttle => 7,
        :players => {
          'player' => {
            :name => 'player_name',
            :status => :alive,
            :role => :captain,
            :stage => :events,
            :event => :voting,
            :shared_inventory => {:food=>0, :parts=>0, :work=>1}
          },
          'otter' => {
            :name => 'otter_player_name',
            :status => :alive,
            :role => :pilot,
            :stage => :events,
            :event => :voting,
            :shared_inventory => {:food=>0, :parts=>0, :work=>1}
          },
            'anotter' => {
            :name => 'anotter_player_name',
            :status => :alive,
            :role => :mechanic,
            :stage => :events,
            :event => :voting,
            :shared_inventory => {:food=>0, :parts=>0, :work=>1}
          }
        },
        :locations => locations
      })
    end
  end

  describe 'Waiting' do

    it 'sets the stage to waiting if the player is ahead of the rest' do
      Services::Actions.send(:save, game_id, @player_hash['uuid'], @vote_one)
      game_status = Services::GameStatus.new game_id
      expect(game_status.get_stats['player'][:game_stats]).to eq(
      {
        :game => game,
        :current_slot => 4,
        :escape_shuttle => 7,
        :players => {
          'player' => {
            :name => 'player_name',
            :status => :alive,
            :role => :captain,
            :stage => :wait,
            :event => :defaultEvent,
            :shared_inventory => {:food=>0, :parts=>0, :work=>1}
          },
          'otter' => {
            :name => 'otter_player_name',
            :status => :alive,
            :role => :pilot,
            :stage => :events,
            :event => :voting,
            :shared_inventory => {:food=>0, :parts=>0, :work=>1}
          },
            'anotter' => {
            :name => 'anotter_player_name',
            :status => :alive,
            :role => :mechanic,
            :stage => :events,
            :event => :voting,
            :shared_inventory => {:food=>0, :parts=>0, :work=>1}
          }
        },
        :locations => locations
      })
    end
  end

  describe 'Events' do

    it 'triggers a voting event when needed' do
      game_status = Services::GameStatus.new game_id
      expect(game_status.get_stats['player'][:game_stats]).to eq(
      {
        :game => game,
        :current_slot => 4,
        :escape_shuttle => 7,
        :players => {
          'player' => {
            :name => 'player_name',
            :status => :alive,
            :role => :captain,
            :stage => :events,
            :event => :voting,
            :shared_inventory => {:food=>0, :parts=>0, :work=>1}
          },
          'otter' => {
            :name => 'otter_player_name',
            :status => :alive,
            :role => :pilot,
            :stage => :events,
            :event => :voting,
            :shared_inventory => {:food=>0, :parts=>0, :work=>1}
          },
            'anotter' => {
            :name => 'anotter_player_name',
            :status => :alive,
            :role => :mechanic,
            :stage => :events,
            :event => :voting,
            :shared_inventory => {:food=>0, :parts=>0, :work=>1}
          }
        },
        :locations => locations
      })
    end
  end

  describe 'Turbo' do

    let(:turbo_locations){
      [
        {
          :uuid=>"1",
          :status=>:locked
        },
        {
          :uuid=>"2",
          :status=>:marked
        },
        {
          :uuid=>"3",
          :status=>:unlocked
        },
        {
          :uuid=>"4",
          :status=>:locked
        },
        {
          :uuid=>"5",
          :status=>:marked
        },
        {
          :uuid=>"6",
          :status=>:unlocked
        },
        {
          :uuid=>"7",
          :status=>:marked
        },
        {
          :uuid=>"8",
          :status=>:locked
        }
      ]
    }

    before(:each){
      db['games'].insert_one(turbo_game)
      allow(Time).to receive(:now).and_return(500)
      turbo_game.delete(:_id)
      Services::Games.add_player turbo_game_id, @player_hash['uuid'], @player_hash['name']
      Services::Games.add_player turbo_game_id, @otter_player_hash['uuid'], @otter_player_hash['name']
      Services::Games.add_player turbo_game_id, @anotter_player_hash['uuid'], @anotter_player_hash['name']
    }

    it 'adds default actions if players are absent' do
      turbo_game[:time] = 300
      game_status = Services::GameStatus.new turbo_game_id
      expect(game_status.get_stats['player'][:game_stats]).to eq(
      {
        :game => turbo_game,
        :current_slot => 4,
        :escape_shuttle => 10,
        :players => {
          'player' => {
            :name => 'player_name',
            :status => :alive,
            :role => :captain,
            :stage => :events,
            :event => :fusion,
            :shared_inventory => {:food=>0, :parts=>0, :work=>0}
          },
          'otter' => {
            :name => 'otter_player_name',
            :status => :alive,
            :role => :pilot,
            :stage => :events,
            :event => :fusion,
            :shared_inventory => {:food=>0, :parts=>0, :work=>0}
          },
            'anotter' => {
            :name => 'anotter_player_name',
            :status => :alive,
            :role => :mechanic,
            :stage => :events,
            :event => :fusion,
            :shared_inventory => {:food=>0, :parts=>0, :work=>0}
          }
        },
        :locations => turbo_locations
      })
    end
  end
end
