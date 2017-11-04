class TeamInventory
  def initialize xxx = nil
    return @inventory = xxx if xxx.is_a? Hash

    @inventory = initial_inventory
  end

  def [] key
    return 0 unless has_key? key
    inventory[key]
  end

  def has_key? what
    inventory.has_key? what
  end

  def add what, amount
    inventory[what] += amount
  end

  def add_item what
    inventory[what] = 1
  end

  def subtract what, amount
    inventory[what] -= amount
  end

  def subtract_all what
    inventory[what] = 0
  end

  def to_h
    inventory.to_h
  end

  def empty
    @inventory = an_empty_inventory
  end

  def empty?
    inventory == an_empty_inventory
  end

  private
  attr_reader :inventory

  def initial_inventory
    {
      parts: 0
    }
  end

  def an_empty_inventory
    {
      parts: 0
    }
  end
end
