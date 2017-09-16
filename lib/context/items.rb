class Items
  def initialize xxx
    @items = {
      'escape shuttle' => {
        countdown: 20,
        fix: 10
      },
      'pick' => {
        parts: 5
      }
    }
  end

  def [] key
    @items[key]
  end

  def to_h
    @items.to_h
  end
end
