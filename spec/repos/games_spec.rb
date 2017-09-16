describe Repos::Games do

  let(:game_name){'sample_game_name'}
  let(:game_uuid){'sample_game_uuid'}
  let(:type){'private'}
  let(:password){'password'}
  let(:host){'sample_host_uuid'}

  describe '#save' do
    it 'stores the game' do
      Repos::Games.save game_name, game_uuid, type, password, host

      saved_entry = db['games'].find.limit(1).first
      expect(saved_entry).to include({
        "name" => 'sample_game_name',
        "uuid" => 'sample_game_uuid',
        "type" => 'private',
        "password" => 'password',
        "status" => 'ready',
        "host" => 'sample_host_uuid',
        "style" => 'gentle'
      })
    end
  end

  describe '#exists?' do
    it 'checks the existence of the game with a given name' do
      Repos::Games.save game_name, game_uuid, type, password, host

      expect(Repos::Games.exists? game_uuid).to eq true
      expect(Repos::Games.exists? 'other_game_name').to eq false
    end
  end

  describe '#repeated?' do
    it 'checks the existence of the game with a given name' do
      Repos::Games.save game_name, game_uuid, type, password, host

      expect(Repos::Games.repeated? game_name).to eq true
      expect(Repos::Games.repeated? 'other_game_name').to eq false
    end
  end

  describe '#list' do
    it 'returns a list of games' do
      game = {
        "game_name" => 'sample_game_name',
        "game_uuid" => 'sample_game_uuid'
      }

      db['games'].insert_one(game)
      expect(Repos::Games.list).to contain_partial_hash(game)
    end
  end

  describe '#game' do
    it 'returns the game' do
      Repos::Games.save game_name, game_uuid, type, password, host
      expect(Repos::Games.game game_uuid).to include({
        name: 'sample_game_name',
        uuid: 'sample_game_uuid',
        type: 'private',
        password: 'password',
        status: 'ready',
        host: 'sample_host_uuid',
        style: 'gentle'
      })
    end
  end

  describe '#start' do
    it 'changes the status of a game to ongoing' do
      Repos::Games.save game_name, game_uuid, type, password, host
      game = {
        uuid: game_uuid,
        style: 'turbo',
        lapse: 30,
      }
      Repos::Games.start game
      saved_entry = db['games'].find.limit(1).first
      expect(saved_entry).to include({
        "name" => 'sample_game_name',
        "uuid" => 'sample_game_uuid',
        "type" => 'private',
        "password" => 'password',
        "status" => 'ongoing',
        "host" => 'sample_host_uuid',
      })
    end
  end

  describe '#save_time' do
    it 'updates the time entry' do
      Repos::Games.save game_name, game_uuid, type, password, host
      Repos::Games.save_time game_uuid, 300
      expect((Repos::Games.game game_uuid)[:time]).to eq(300)
    end
  end
end
