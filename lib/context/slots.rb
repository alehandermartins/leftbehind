class Slots
  def initialize slots_list, players
    @slots = slots_list
    @players = players
  end

  def [] id
    slots[id]
  end

  def completed_number
    completed_ones.length
  end

  def completed_ones
    slots.values.select { |slot|
      slot.completed? @players.number
    }
  end

  def completed_number_for player
    slots.values.select { |slot|
      slot.completed_for? player
    }.length
  end

  def max_completed
    @players.map{ |player|
      completed_number_for player.uuid
    }.max
  end

  def to_h
    slots.values.map { |the_slot|
      the_slot.to_h
    }
  end

  private
  attr_reader :slots
end
