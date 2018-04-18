class Information
  attr_reader :information

  def initialize players_hashes
    @information = players_hashes.map do |player_hash|
      [player_hash['uuid'], empty_info]
    end.to_h
  end

  def empty_info
    {
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
    @information[performer][:traits].push(trait)
  end

  def to_h
    information.to_h
  end
end
