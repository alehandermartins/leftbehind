class IA
  def initialize
    @location
    @mark_count = 1
  end

  def activate locations
    locations.unmark_all
    @location = locations.mark_random @mark_count
    locations.lock_random
    @mark_count += 1 if @mark_count < 3
  end

  def location
    @location
  end
end
