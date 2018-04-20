class Information
  attr_reader :information

  def initialize players_hashes
    @information = players_hashes.map do |player_hash|
      [player_hash['uuid'], basic_info(player_hash)]
    end.to_h
  end

  def basic_info player_hash
    {
      uuid: player_hash['uuid'],
      name: player_hash['name'],
      role: player_hash['role'],
      actions: {},
      traits: []
    }
  end

  def [] key
    information[key]
  end

  def has_key? what
    information.has_key? what
  end

  def add_to subject, topic, info
    information[subject] ||= {}
    information[subject][topic] = info
  end

  def add_action performer, slot, info
    @information[performer][:actions][slot] = info
  end

  def add_trait performer, trait
    return if @information[performer][:traits].include?(trait)
    @information[performer][:traits].push(trait)
  end

  def to_h
    information.to_h
  end
end
