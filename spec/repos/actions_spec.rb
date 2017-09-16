describe Repos::Actions do

  let(:transformed_actions){
    [{
      game: 'the_game',
      player: 'the_player',
      slot: 1,
      name: 'morning_action',
      payload: 'morning_payload'
    },
    {
      game: 'the_game',
      player: 'the_player',
      slot: 2,
      name: 'afternoon_action',
      payload: 'afternoon_payload'
    }]
  }

  let(:transformed_otter_actions){
    [{
      game: 'the_game',
      player: 'otter_player',
      slot: 1,
      name: 'morning_action',
      payload: 'morning_payload'
    },
    {
      game: 'the_game',
      player: 'otter_player',
      slot: 2,
      name: 'afternoon_action',
      payload: 'afternoon_payload'
    }]
  }

  describe '.save' do
    it 'stores the selected actions' do

      Repos::Actions.save transformed_actions

      saved_entry = db['actions'].find.to_a
      expect(saved_entry[0]).to include({
        'game' => 'the_game',
        'name' => 'morning_action',
        'player' => 'the_player',
        'slot' => 1,
        'payload' => 'morning_payload'
      })

      expect(saved_entry[1]).to include({
        'game' => 'the_game',
        'name' => 'afternoon_action',
        'player' => 'the_player',
        'slot' => 2,
        'payload' => 'afternoon_payload'
      })
    end
  end

  describe '.remove' do
    it 'removes the selected actions' do
      player = 'the_player'
      game = 'the_game'
      slot = 1

      db['actions'].insert_many(transformed_actions)
      Repos::Actions.remove game, player, slot
      retreived_actions = Repos::Actions.grab_for player, game
      expect(retreived_actions).not_to include({
        'game' => 'the_game',
        'name' => 'morning_action',
        'player' => 'the_player',
        'slot' => 1,
        'payload' => 'morning_payload'
      })
    end
  end


  describe '.grab' do
    it 'returns an empty array when no actions are stored' do
      # player = 'the_player'
      game = 'the_game'

      retrived_actions = Repos::Actions.grab game
      expect(retrived_actions).to eq([])
    end

    it 'retrieves the actions selected' do
      player = 'the_player'
      game = 'the_game'

      db['actions'].insert_many(transformed_actions)
      db['actions'].insert_many(transformed_otter_actions)
      # Repos::Actions.save(transformed_actions)

      retrived_actions = Repos::Actions.grab game

      expect(retrived_actions).to eq([
        {
          :game => 'the_game',
          :player => 'the_player',
          :slot=>1,
          :name => 'morning_action',
          :payload => 'morning_payload'
        },
        {
          :game => 'the_game',
          :player => 'the_player',
          :slot => 2,
          :name => 'afternoon_action',
          :payload => 'afternoon_payload'
        },
        {
          :game => 'the_game',
          :player => 'otter_player',
          :slot=>1,
          :name => 'morning_action',
          :payload => 'morning_payload'
        },
        {
          :game => 'the_game',
          :player => 'otter_player',
          :slot => 2,
          :name => 'afternoon_action',
          :payload => 'afternoon_payload'
        }
      ])
    end
  end

  describe '.grab_for' do
    it 'returns an empty array when no actions are stored' do
      player = 'the_player'
      game = 'the_game'

      retrived_actions = Repos::Actions.grab_for player, game
      expect(retrived_actions).to eq([])
    end

    it 'retrieves the actions selected' do
      player = 'the_player'
      game = 'the_game'

      db['actions'].insert_many(transformed_actions)
      db['actions'].insert_many(transformed_otter_actions)
      # Repos::Actions.save(transformed_actions)

      retrived_actions = Repos::Actions.grab_for player, game
      expect(retrived_actions).to eq([
        {
          :game => 'the_game',
          :player => 'the_player',
          :slot=>1,
          :name => 'morning_action',
          :payload => 'morning_payload'
        },
        {
          :game => 'the_game',
          :player => 'the_player',
          :slot => 2,
          :name => 'afternoon_action',
          :payload => 'afternoon_payload'
        }
      ])
    end
  end
end
