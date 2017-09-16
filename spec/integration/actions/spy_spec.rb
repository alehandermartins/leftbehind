describe 'Spy' do

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

    Services::Games.add_player game_id, player_hash['uuid'], player_hash['name']
    Services::Games.add_player game_id, otter_player_hash['uuid'], otter_player_hash['name']

    spy_otter = {
      'morning' => {
        'name' => 'spy',
        'payload' => {
          'target' => 'otter'
        }
      }
    }

    search_infirmary = {
      'morning' => {
        'name' => 'search',
        'payload' => {
          'location' => '4',
        }
      }
    }

    Services::Actions.send :save, game_id, player_hash['uuid'], spy_otter
    Services::Actions.send :save, game_id, otter_player_hash['uuid'], search_infirmary

    @initial_context = Context.build_for game_id
    @player = @initial_context.players['player']
    @otter = @initial_context.players['otter']

    @one_action = @initial_context.slots[1].actions.first
    @otter_action = @initial_context.slots[1].actions.last
  }

  it 'tells the spied player action and inventory' do
    @otter.inventory.add :food, 1
    @otter.inventory.add :parts, 2

    derived_context = @otter_action.run @initial_context
    derived_context = @one_action.run derived_context

    derived_context = @otter_action.resolve derived_context
    derived_context = @one_action.resolve derived_context

    expect(@player.information['otter']).to eq(@otter.information['otter'])

    expect(@player.information['player'][1][:result][:info]).to eq(:target_info => {:action=>"LB::Action::Search", :payload=>{:location=>"4"}, :inventory=>{:food=>2, :parts=>2, :helmet=>1}})
  end

  it 'does not store any information if failed' do
    @otter.inventory.add :food, 1
    @otter.inventory.add :parts, 2

    derived_context = @one_action.run @initial_context
    @one_action.add_status :fail
    derived_context  = @one_action.resolve derived_context

    expect(@player.information['otter']).to eq(nil)
  end

  it 'fails if target left behind' do
    @player.escape
    derived_context = @one_action.run @initial_context
    derived_context  = @one_action.resolve derived_context

    expect(@player.information['player'][1][:result][:info]).to contain_partial_hash(reason: 'action.escape.result.you_left')
  end

  it 'fails if player left behind and target escaped' do
    @otter.escape
    derived_context = @one_action.run @initial_context
    derived_context  = @one_action.resolve derived_context

    expect(@player.information['player'][1][:result][:info]).to contain_partial_hash(reason: 'action.escape.result.target_left')
  end
end
