class Locations
  def initialize random_generator
    desired_supplies = {
      food: 32,
      parts: 15,
      helmet: 0
    }

    @locations = initial_inventories(uuids, desired_supplies, random_generator)
    lock random_generator
  end

  def initial_inventories uuids, amounts, generator
    empty_inventories = Array.new(uuids.size) {initial_inventory}
    distribution = Hash[uuids.zip(empty_inventories)]

    amounts.each do |resource, quantity|
      quantity.times do |it|
        place = uuids.sample(random: generator)
        # ap "putting a #{resource} in #{place}"
        distribution[place][:inventory][resource] += 1
      end
    end

    distribution
  end

  def uuids
    (1..8).to_a.map(&:to_s)
  end

  def initial_inventory
    {
      inventory:{
        food: 0,
        parts: 0,
        helmet: 0
      },
      status: :unlocked
    }
  end

  def [] key
    @locations[key]
  end

  def to_h
    @locations.to_h
  end

  def lock generator
    @locations['8'][:status] = :locked
    places = ['1', '2', '3', '4', '5', '7'].sample(2, random: generator)
    2.times do |it|
      @locations[places[it]][:status] = :locked
    end
  end
end
