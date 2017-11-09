class Locations
  def initialize random_generator
    desired_supplies = {
      parts: 16,
      energy: 16,
      helmet: 0
    }

    @locations = initial_inventories(uuids, desired_supplies, random_generator)
    @generator = random_generator
    @unlocked_list = Array.new
    initial_lock
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
        parts: 0,
        energy: 0,
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

  def hack uuid
    @locations[uuid][:status] = :hacked
  end

  def lock uuid
    @locations[uuid][:status] = :locked
  end

  def mark uuid
    @locations[uuid][:status] = :marked
  end

  def unmark_all
    @locations.each{ |uuid, location|
      unlock uuid if location[:status] == :marked
    }
  end

  def unlock uuid
    @locations[uuid][:status] = :unlocked
    @unlocked_list << uuid
  end

  def lock_random
    uuid = @locations.map{ |uuid, location|
      uuid if location[:status] == :unlocked && !@unlocked_list.include?(uuid)
    }.compact.sample(random: @generator)
    lock uuid unless uuid.nil?
    @unlocked_list.clear
  end

  def mark_random amount
    places = @locations.map{ |uuid, location|
      uuid if location[:status] == :unlocked
    }.compact.sample(amount, random: @generator)

    places.reject!{ |place| place == '7' } if amount < 3

    places.each{ |uuid| mark uuid }
    places.sample(random: @generator)
  end

  def initial_lock
    @locations['8'][:status] = :locked
  end
end
