class IA
  def initialize locations, generator
    @location
    @lurk_count = 1
    @generator = generator
    lurk locations
  end

  def activate locations
    locations.unmark_all
    lurk locations
    locations.lock_random
  end

  def location
    @location
  end

  private

  def lurk locations
    places = locations.to_h.map{ |uuid, location|
      uuid if location[:status] == :unlocked
    }.compact.sample(@lurk_count, random: @generator)
    places.each{ |uuid|
      locations.mark uuid
    }
    @location = places.sample(random: @generator)
    @lurk_count += 1 if @lurk_count < 3
  end
end
