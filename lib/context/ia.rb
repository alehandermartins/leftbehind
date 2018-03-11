class IA
  def initialize locations
    @locations = locations
    @location
    @mark_count = 1
    @locations.mark_random @mark_count
  end

  def activate
    @locations.unmark_all
    @location = @locations.mark_random @mark_count
    @mark_count += 1 if @mark_count < 3
  end

  def location
    @location
  end
end
