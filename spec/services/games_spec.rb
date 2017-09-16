require 'uuid'
describe Services::Games do
  let(:game_uuid) { 'a_game' }
  let(:type){ 'private' }
  let(:password){ 'password' }
  let(:player) { 'a_player' }
  let(:day) { 'some_day' }
  let(:actions) { double('actions') }
  let(:compute_actions) { double('compute_actions') }
  let(:actions_repo) { double('Actions Repo') }
  let(:compute_actions_repo){ double('ComputedActions Repo')}
  let(:games_repo){ double('Games Repo')}
  let(:actions_service){ double('Actions Service')}
  let(:players_repo){ double('Players Repo')}

  before(:each){
    stub_const('Repos::Actions', actions_repo)
    stub_const('Repos::ComputedActions', compute_actions_repo)
    stub_const('Repos::Games', games_repo)
    stub_const('Repos::Players', players_repo)
    stub_const('Services::Actions', actions_service)
  }

  some_actions = {
    'morning' => {
      'label' => 'Defend',
      'action' => 'defend'
    },
    'afternoon' => {
      'label' => 'Spy',
      'action' => 'spy',
      'payload' => {
        'target' => 'player_uuid'
      }
    },
    'evening' => {
      'label' => 'Steal',
      'action' => 'steal',
      'payload' => {
        'target' => 'player_uuid'
      }
    },
    'midnight'=> {
      'label'=> 'Work',
      'action'=> 'work'
    },
    'name' => 'player_name',
    'uuid' => 'target_player'
  }
  everybody_actions = [some_actions]

  describe '#create' do
    it 'tells the repo to save the created game' do
      allow(games_repo).to receive(:repeated?).and_return(false)
      expect(games_repo).to receive(:create)
      Services::Games.create game_uuid, type, password, player
    end

    it 'returns the created game uuid' do
      allow(games_repo).to receive(:repeated?).and_return(false)
      allow(games_repo).to receive(:create).and_return(SecureRandom.uuid)
      result = Services::Games.create game_uuid, type, password, player
      expect(UUID.validate result).to be true
    end

    it 'fails when the game already exists' do
      allow(games_repo).to receive(:repeated?).and_return(true)
      expect {
        Services::Games.create game_uuid, type, password, player
      }.to raise_error LB::Invalid::GameName
    end
  end

  describe '#add_player' do
    let(:player_name) { 'sample_player' }
    let(:player_uuid) { 'sample_uuid' }
    let(:game_uuid) { 'sample_game_uuid' }

    before(:each){
      allow(players_repo).to receive(:player_exists?).and_return(false)
      allow(players_repo).to receive(:name_exists?).and_return(false)
    }

    it 'tells the repo to store the player with a given game_uuid' do
      allow(games_repo).to receive(:exists?).and_return(true)
      allow(players_repo).to receive(:grab).and_return([])

      expect(players_repo).to receive(:add)
      Services::Games.add_player game_uuid, player_name, player_uuid
    end

    it "fails when game doesn't exist" do
      allow(games_repo).to receive(:exists?).and_return(false)
      allow(players_repo).to receive(:add)

      expect {
        Services::Games.add_player game_uuid, player_name, player_uuid
      }.to raise_error LB::Invalid::Game
    end

    it "fails when player is already in the game" do
      allow(games_repo).to receive(:exists?).and_return(true)
      allow(players_repo).to receive(:grab).and_return([])
      allow(players_repo).to receive(:player_exists?).and_return(true)
      allow(players_repo).to receive(:name_exists?).and_return(false)

      expect {
        Services::Games.add_player game_uuid, player_name, player_uuid
      }.to raise_error LB::Invalid::Player
    end

    it "fails when player name is already in the game" do
      allow(games_repo).to receive(:exists?).and_return(true)
      allow(players_repo).to receive(:grab).and_return([])
      allow(players_repo).to receive(:player_exists?).and_return(false)
      allow(players_repo).to receive(:name_exists?).and_return(true)

      expect {
        Services::Games.add_player game_uuid, player_name, player_uuid
      }.to raise_error LB::Invalid::Name
    end

    it "fails when game is already full" do
      allow(games_repo).to receive(:exists?).and_return(true)
      allow(players_repo).to receive(:name_exists?).and_return(false)
      allow(players_repo).to receive(:player_exists?).and_return(false)
      allow(players_repo).to receive(:grab).and_return([])
      stub_const('Services::Games::MAXIMUM_PLAYERS', 0)

      expect {
        Services::Games.add_player game_uuid, player_name, player_uuid
      }.to raise_error LB::Invalid::Game
    end
  end

  describe '#start' do
    it 'starts a game' do
      expect(Repos::Games).to receive(:start).with(game_uuid)
      Services::Games.start game_uuid
    end
  end

  describe '#ready?' do
    it 'tells whether the game has enough players' do
      expect(players_repo).to receive(:grab).with(game_uuid).and_return([])
      allow(games_repo).to receive(:exists?).and_return(true)

      expect(Services::Games.ready? game_uuid).to eq false
    end

    it 'checks if the game exists' do
      expect(games_repo).to receive(:exists?).and_return(false)

      expect{Services::Games.ready? game_uuid}.to raise_error LB::Invalid::Game
    end

    it 'allows the game to start with a given number players' do
      a_number_of_players = 3
      stub_const("Services::Games::MINIMUM_NEEDED_PLAYERS", a_number_of_players)
      allow(games_repo).to receive(:exists?).and_return(true)
      expect(players_repo).to receive(:grab).with(game_uuid).and_return([
        {
          player_name: 'carxofeta',
          player_uuid: 'bajoqueta',
          game_uuid: game_uuid
        },{
          player_name: 'carxofeta',
          player_uuid: 'bajoqueta',
          game_uuid: game_uuid
        },{
          player_name: 'carxofeta',
          player_uuid: 'bajoqueta',
          game_uuid: game_uuid
        }
      ])

      expect(Services::Games.ready?(game_uuid)).to eq true
    end
  end

  describe '#available' do
    it 'returns a list of available games' do
      ready_game = {
        "name" => 'My game',
        "uuid" => 'sample_uuid',
        "status" => 'ready'
      }
      ongoing_game = {
        "name" => 'My second game',
        "uuid" => 'sample_uuid',
        "status" => 'ongoing'
      }

      sample_games_list = [ready_game, ongoing_game]

      expect(games_repo).to receive(:list).and_return(sample_games_list)

      expect(Services::Games.available).to eq([ready_game])
    end

    it 'returns an empty list when no available games' do
      allow(games_repo).to receive(:list).and_return([])
      expect(Services::Games.available).to eq []
    end
  end

  describe '#ongoing' do
    let(:player_uuid){ 'sample_player_uuid' }
    it 'returns a list of player ongoing games' do
      sample_games_list = [
        {
          "name" => 'My game',
          "uuid" => 'sample_uuid'
        },{
          "name" => 'My second game',
          "uuid" => 'sample_uuid'
        }
      ]

      expect(players_repo).to receive(:list).and_return(['sample_uuid'])
      expect(games_repo).to receive(:list).and_return(sample_games_list)

      expect(Services::Games.ongoing player_uuid).to eq sample_games_list
    end

    it 'returns an empty list when no player ongoing games' do
      allow(players_repo).to receive(:list).and_return([])
      expect(games_repo).to receive(:list).and_return([])
      expect(Services::Games.ongoing player_uuid).to eq []
    end
  end
end
