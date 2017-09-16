describe 'Actions' do

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
      'morning' => search_cabins,
      'afternoon' => search_cabins,
      'evening' => work,
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
    Services::Actions.save_actions game_id, @player_hash['uuid'], @player_actions
    Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @otter_actions
    Services::Actions.save_actions game_id, @anotter_player_hash['uuid'], @anotter_actions
  }

  def transformed_actions
    [{
      game: 'deadbeef',
      player: 'player',
      slot: 1,
      name: 'work',
      payload: {
        item: 'escape shuttle'
      }
    },
    {
      game: 'deadbeef',
      player: 'player',
      slot: 2,
      name: 'work',
      payload: {
        item: 'escape shuttle'
      }
    },
    {
      game: 'deadbeef',
      player: 'player',
      slot: 3,
      name: 'work',
      payload: {
        item: 'escape shuttle'
      }
    },
    {
      game: 'deadbeef',
      player: 'player',
      slot: 4,
      name: 'work',
      payload: {
        item: 'escape shuttle'
      }
    }]
  end

  def transformed_voting
    [{
      :game => 'deadbeef',
      :player => 'player',
      :slot => 5,
      :name => 'vote',
      :payload => {
        :target=>['otter']
      }
    }]
  end

  def transformed_eating
    [{
      :game => 'deadbeef',
      :player => 'player',
      :slot => 6,
      :name => 'eat',
      :payload => {
        :resource => 'food'
      }
    }]
  end

  def transformed_empty
    [{
      :game => 'deadbeef',
      :player => 'player',
      :slot => 5,
      :name => 'vote',
      :payload => {
        :target=>[]
      }
    }]
  end

  def transformed_dead
    [{
      :game => 'deadbeef',
      :player => 'player',
      :slot => 7,
      :name => 'playdead',
      :payload => {}
    },
    {
      :game => 'deadbeef',
      :player => 'player',
      :slot => 8,
      :name => 'playdead',
      :payload => {}
    },
    {
      :game => 'deadbeef',
      :player => 'player',
      :slot => 9,
      :name => 'playdead',
      :payload => {}
    },
    {
      :game => 'deadbeef',
      :player => 'player',
      :slot => 10,
      :name => 'playdead',
      :payload => {}
    }]
  end

  def transformed_dead_voting
    [{
      :game => 'deadbeef',
      :player => 'player',
      :slot => 11,
      :name => 'playdead',
      :payload => {}
    }]
  end

  describe 'Actions' do

    it 'stores the player actions' do
      retrieved_actions = Services::Actions.send :retrieve, game_id, @player_hash['uuid']

      expect(retrieved_actions).to eq(transformed_actions)
    end
  end

  describe 'Eating' do

    it 'does not add eating actions until everyone played the event' do
      Services::Actions.save_actions game_id, @player_hash['uuid'], @vote_one
      Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @vote_two

      retrieved_actions = Services::Actions.send :retrieve, game_id, @player_hash['uuid']
      expect(retrieved_actions).to eq(transformed_actions + transformed_voting)
    end

    it 'does add eating actions after everyone played the event' do
      Services::Actions.save_actions game_id, @player_hash['uuid'], @vote_one
      Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @vote_two
      Services::Actions.save_actions game_id, @anotter_player_hash['uuid'], @vote_two

      retrieved_actions = Services::Actions.send :retrieve, game_id, @player_hash['uuid']
      expect(retrieved_actions).to eq(transformed_actions + transformed_voting + transformed_eating)
    end
  end

  describe 'Dead' do
    before(:each){
      Services::Actions.save_actions game_id, @player_hash['uuid'], @vote_one
      Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @vote_two
      Services::Actions.save_actions game_id, @anotter_player_hash['uuid'], @vote_two
    }

    it 'does not add dead actions until alive players have sent theirs' do
      Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @otter_actions

      retrieved_actions = Services::Actions.send :retrieve, game_id, @player_hash['uuid']
      expect(retrieved_actions).to eq(transformed_actions + transformed_voting + transformed_eating)
    end

    it 'does add dead actions when alive players have sent theirs' do
      Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @otter_actions
      Services::Actions.save_actions game_id, @anotter_player_hash['uuid'], @anotter_actions

      retrieved_actions = Services::Actions.send :retrieve, game_id, @player_hash['uuid']
      expect(retrieved_actions).to eq(transformed_actions + transformed_voting + transformed_eating + transformed_dead)
    end

    it 'does add dead actions when alive players have sent theirs' do
      Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @otter_actions
      Services::Actions.save_actions game_id, @anotter_player_hash['uuid'], @anotter_actions

      retrieved_actions = Services::Actions.send :retrieve, game_id, @player_hash['uuid']
      expect(retrieved_actions).to eq(transformed_actions + transformed_voting + transformed_eating + transformed_dead)
    end

    it 'does add dead sharing when alive players have sent theirs' do
      Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @otter_actions
      Services::Actions.save_actions game_id, @anotter_player_hash['uuid'], @anotter_actions

      retrieved_actions = Services::Actions.send :retrieve, game_id, @player_hash['uuid']
      expect(retrieved_actions).to eq(transformed_actions + transformed_voting + transformed_eating + transformed_dead)
    end

    it 'does add dead voting when alive players have sent theirs' do
      Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @otter_actions
      Services::Actions.save_actions game_id, @anotter_player_hash['uuid'], @anotter_actions

      Services::Actions.save_actions game_id, @otter_player_hash['uuid'], @vote_two
      Services::Actions.save_actions game_id, @anotter_player_hash['uuid'], @vote_two

      retrieved_actions = Services::Actions.send :retrieve, game_id, @player_hash['uuid']
      expect(retrieved_actions).to eq(transformed_actions + transformed_voting + transformed_eating + transformed_dead + transformed_dead_voting + [{
        :game => 'deadbeef',
        :player => 'player',
        :slot => 12,
        :name => 'eat',
        :payload => {
          :resource => 'food'
        }
      }])
    end
  end

  describe 'Add default' do
    let(:default_game_id){'default'}
    let(:default_game){
      {
        name: 'sample_game_name',
        uuid: default_game_id,
        type: 'private',
        password: 'password',
        status: 'ready',
        host: 'player',
        style: 'turbo',
        lapse: 300,
        time: 0
      }
    }

    before(:each){
      db['games'].insert_one(default_game)
      default_game.delete(:_id)
      Services::Games.add_player default_game_id, @player_hash['uuid'], @player_hash['name']
      Services::Games.add_player default_game_id, @otter_player_hash['uuid'], @otter_player_hash['name']

      @initial_context = Context.build_for default_game_id
      @stats = {
        'player' =>{
          game_stats: {
            players: {
              'player' => {
                stage: :actions,
                event: 'defaultEvent'
              },
              'otter' => {
                stage: :actions,
                event: 'defaultEvent'
              }
            }
          }
        },
        'otter' =>{
          game_stats: {
            players: {
              'player' => {
                stage: :actions,
                event: 'defaultEvent'
              },
              'otter' => {
                stage: :actions,
                event: 'defaultEvent'
              }
            }
          }
        }
      }
    }

    it 'increases the game time, one lapse' do
      expect(Repos::Games).to receive(:save_time).with(default_game_id, 300)
      Services::Actions.add_default default_game, @initial_context, @stats
    end

    it 'adds default actions to player' do
      Services::Actions.add_default default_game, @initial_context, @stats

      retrieved_actions = Services::Actions.send :retrieve, default_game_id, @player_hash['uuid']
      expect(retrieved_actions).to eq([
        {
          :game=>"default",
          :player=>"player",
          :slot=>1,
          :name=>"none",
          :payload=>{}
        },
        {
          :game=>"default",
          :player=>"player",
          :slot=>2,
          :name=>"none",
          :payload=>{}
        },
        {
          :game=>"default",
          :player=>"player",
          :slot=>3,
          :name=>"none",
          :payload=>{}
        },
        {
          :game=>"default",
          :player=>"player",
          :slot=>4,
          :name=>"none",
          :payload=>{}
        }
      ])
    end

    it 'adds dead actions to dead players' do
      player = @initial_context.players['player']
      player.kill
      Services::Actions.add_default default_game, @initial_context, @stats

      retrieved_actions = Services::Actions.send :retrieve, default_game_id, @player_hash['uuid']
      expect(retrieved_actions).to eq([
        {
          :game =>"default",
          :player=>"player",
          :slot=>1,
          :name=>'playdead',
          :payload=>{}
        },
        {
          :game=>"default",
          :player=>"player",
          :slot=>2,
          :name=>'playdead',
          :payload=>{}
        },
        {
          :game=>"default",
          :player=>"player",
          :slot=>3,
          :name=>"playdead",
          :payload=>{}
        },
        {
          :game=>"default",
          :player=>"player",
          :slot=>4,
          :name=>"playdead",
          :payload=> {}
        }
      ])
    end
  end
end
