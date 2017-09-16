describe 'Defend' do

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

  let(:steal_otter){
    {
      'morning' => {
        'name' => 'steal',
        'payload' => {
          'target' => 'otter',
          'resource' => 'food'
        }
      }
    }
  }

  let(:spy_otter){
    {
      'morning' => {
        'name' => 'spy',
        'payload' => {
          'target' => 'otter'
        }
      }
    }
  }

  let(:defend){
    {
      'morning' => {
        'name' => 'defend',
        'payload' => {
          'label' => 'Defend'
        }
      }
    }
  }

  before(:each){
    game_id = 'deadbeef'

    db['games'].insert_one({
      name: 'test_game',
      uuid: game_id
    })

    Services::Games.add_player game_id, player_hash['uuid'], player_hash['name']
    Services::Games.add_player game_id, otter_player_hash['uuid'], otter_player_hash['name']
    Services::Games.add_player game_id, anotter_player_hash['uuid'], anotter_player_hash['name']

    Services::Actions.send :save, game_id, player_hash['uuid'], steal_otter
    Services::Actions.send :save, game_id, otter_player_hash['uuid'], defend
    Services::Actions.send :save, game_id, anotter_player_hash['uuid'], spy_otter

    @initial_context = Context.build_for game_id
    @player = @initial_context.players['player']
    @otter = @initial_context.players['otter']
    @anotter = @initial_context.players['anotter']

    @one_action = @initial_context.slots[1].actions.first
    @otter_action = @initial_context.slots[1].actions[1]
    @anotter_action = @initial_context.slots[1].actions.last
  }

  it 'handles cooperative situations' do
    derived_context = @one_action.run @initial_context
    derived_context = @anotter_action.run derived_context

    expect(@anotter_action).not_to receive(:add_status)
  end

  it 'adds info of attacking players' do
    derived_context = @one_action.run @initial_context
    derived_context = @otter_action.run derived_context
    derived_context = @anotter_action.run derived_context

    derived_context = @otter_action.resolve derived_context
    derived_context = @one_action.resolve derived_context
    derived_context = @anotter_action.resolve derived_context

    attackers = [
      {
        :action => "LB::Action::Steal",
        :performer => "player",
        :payload => {
          :target => "otter",
          :resource => "food"
        }
      },
      {
        :action => "LB::Action::Spy",
        :performer => "anotter",
          :payload => {
            :target => "otter"
        }
      }
    ]
    player_info = {
      :action => "LB::Action::Steal",
      :payload => {
        :target => "otter",
        :resource => "food"
      },
      :result => {
        :status => :fail,
        :info => {
          :reason => "action.defend.result.attack_defended"
        }
      },
      :inventory => nil
    }

    expect(@otter.information['otter'][1][:result][:info][:attackers]).to eq(attackers)
    expect(@otter.information[@player.uuid][1]).to eq(player_info)
  end

  it 'adds failure to attackers' do
    derived_context = @one_action.run @initial_context
    derived_context = @otter_action.run derived_context
    derived_context = @anotter_action.run derived_context

    derived_context = @otter_action.resolve derived_context
    derived_context = @one_action.resolve derived_context
    derived_context = @anotter_action.resolve derived_context

    expect(@one_action.status).to eq(:fail)
    expect(@anotter_action.status).to eq(:fail)

    otter_info = {
      :action => "LB::Action::Defend",
      :payload => {
        :label => "Defend"
      },
      :result => {
        :info => {
          :attackers => [{
            :action => "LB::Action::Steal",
            :performer => "player",
            :payload => {
              :target => "otter",
              :resource => "food"
            }
          }]
        }
      },
      :inventory => nil
    }

    expect(@player.information['otter'][1]).to eq(otter_info)
  end
end
