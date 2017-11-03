class IA
  def initialize locations, generator
    @location
    @generator = generator
    lurk locations
  end

  def activate locations
    lurk locations
    lock locations
  end

  def lurk locations
    unmark_locations locations

    places = locations.to_h.map{ |uuid, location|
      uuid if location[:status] == :unlocked
    }.compact.sample(3, random: @generator)
    places.each{ |uuid|
      locations.mark uuid
    }
    @location = places.sample(random: @generator)
  end

  def lock locations
    uuid = locations.to_h.map{ |uuid, location|
      uuid if location[:status] == :unlocked && uuid != "8"
    }.compact.sample(random: @generator)
    locations.lock uuid unless uuid.nil?
  end

  def location
    @location
  end

  private

  def unmark_locations locations
    locations.to_h.each{ |uuid, location|
      locations.unlock uuid if location[:status] == :marked
    }
  end
end
