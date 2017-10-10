class Alien
  def initialize locations, generator
    @location
    @generator = generator
    lurk locations
  end

  def lurk locations
    unmark_locations locations

    places = locations.to_h.map{ |uuid, location|
      uuid if location[:status] == :unlocked
    }.compact.sample(3, random: @generator)
    places.each{ |uuid|
      locations[uuid][:status] = :marked
    }
    @location = places.sample(random: @generator)
  end

  def location
    @location
  end

  private

    def unmark_locations locations
      locations.to_h.each{ |uuid, location|
        location[:status] = :unlocked if location[:status] == :marked
      }
    end
end
