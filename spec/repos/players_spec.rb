describe Repos::Players do
  let(:game){'sample_game_uuid'}
  let(:name){'sample_player_name'}
  let(:uuid){'sample_player_uuid'}

  describe '#add' do
    it 'stores the selected player' do

      Repos::Players.add game, uuid, name

      saved_entry = db['players'].find.to_a.first
      expect(saved_entry).to include({
        'game' => 'sample_game_uuid',
        'uuid' => 'sample_player_uuid',
        'name' => 'sample_player_name',
      })
    end
  end

  describe '#name_exists?' do
    it 'checks the existence of the player with a given name' do

      Repos::Players.add game, uuid, name

      expect(Repos::Players.name_exists? game, name).to eq true
      expect(Repos::Players.name_exists? game,'otter_player_name').to eq false
    end
  end

  describe '#player_exists?' do
    it 'checks the existence of the player with a given name' do

      Repos::Players.add game, uuid, name

      expect(Repos::Players.player_exists? game, uuid).to eq true
      expect(Repos::Players.player_exists? game, 'otter_player_uuid').to eq false
    end
  end


  describe '#grab' do
    it 'retrieves the players in given game' do

      Repos::Players.add game, uuid, name
      grabbed_players = Repos::Players.grab game

      expect(grabbed_players).to contain_partial_hash({
        'game' => 'sample_game_uuid',
        'uuid' => 'sample_player_uuid',
        'name' => 'sample_player_name',
      })
    end

    it 'retrieves the players in given game when more than one' do

      Repos::Players.add game, uuid, name
      otter_player_name = 'otter_player_name'
      otter_player_uuid = 'otter_player_uuid'

      Repos::Players.add game, otter_player_uuid, otter_player_name
      grabbed_players = Repos::Players.grab game

      expect(grabbed_players).to contain_partial_hash(
        {
          'game' => 'sample_game_uuid',
          'uuid' => 'sample_player_uuid',
          'name' => 'sample_player_name',
        },
        {
          'game' => 'sample_game_uuid',
          'uuid' => 'otter_player_uuid',
          'name' => 'otter_player_name',
        }
      )
    end
  end

  describe '#list' do
    it 'lists active games for a given player' do

      Repos::Players.add game, uuid, name

      expect(Repos::Players.list uuid).to eq [game]
    end
  end

  describe '#get_name' do
    it 'gets the name by providing the player uuid' do

      Repos::Players.add game, uuid, name

      expect(Repos::Players.get_name game, uuid).to eq ('sample_player_name')
    end
  end
end
