describe 'Players factory' do

  it 'builds a Players collection from a list of player hashes' do
    players_hashes = [
        {'name' => 'player_name', 'uuid' => 'player_uuid'},
        {'name' => 'otter_player_name', 'uuid' => 'otter_player_uuid'},
        {'name' => 'anotter_player_name', 'uuid' => 'anotter_player_uuid'}
      ]

    players = Factories::Players.create(players_hashes)

    expected_players(players_hashes).each do |expected_player|
      expect_players_are_equal(players[expected_player.uuid], expected_player)
    end
  end

  def expect_players_are_equal(actual_player, expected_player)
    expect(actual_player.uuid).to eql(expected_player.uuid)
    expect(actual_player.name).to eql(expected_player.name)
    expect(actual_player.inventory.empty?).to equal(true)
  end

  def expected_players(players_hashes)
    players_hashes.map do |player_hash|
      player = Player.new(player_hash['uuid'], player_hash['name'])
    end
  end
end
