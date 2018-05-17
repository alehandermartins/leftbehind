class Information

  attr_reader :players, :locations

  def initialize players_hashes
    @players = players_hashes.map do |player_hash|
      [player_hash['uuid'], basic_info(player_hash)]
    end.to_h
    @locations = Hash.new
  end

  def basic_info player_hash
    {
      uuid: player_hash['uuid'],
      name: player_hash['name'],
      role: player_hash['role'],
      actions: {},
      traits: [],
    }
  end

  def add_action performer, slot, info
    @players[performer][:actions][slot] = info
  end

  def add_trait performer, trait
    return if @players[performer][:traits].include?(trait)
    @players[performer][:traits].push(trait)
  end

  def add_location location, info
    @locations[location] = info
  end

  def for players
    players.each { |player|
      @players[player.uuid][:status] = player.status
      add_android_features(player) if android?(player)
      add_betrayer_features(player) if betrayer?(player)
    }
    to_h
  end

  def to_h
    {
      players: @players,
      locations: @locations
    }
  end

  private
   def android? player
    @players[player.uuid][:traits].include?(:c3po) || @players[player.uuid][:traits].include?(:terminator)
  end

  def betrayer? player
    @players[player.uuid][:traits].include?(:betrayer) || @players[player.uuid][:traits].include?(:betrayer)
  end

  def add_android_features player
    @players[player.uuid][:condition] = player.condition
    @players[player.uuid][:fix] = player.calculate_fix
  end

  def add_betrayer_features player
    @players[player.uuid][:target] = player.target
  end
end
