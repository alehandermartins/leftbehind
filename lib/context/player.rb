class Player

  def initialize uuid, name
    @uuid = uuid
    @name = name
    @inventory = Inventory.new
    @shared_inventory = Inventory.new(team_inventory)
    @information = Information.new
    @status = :alive
    @tomb = {}
    @events = []
  end

  def inventory
    @inventory
  end

  def shared_inventory
    @shared_inventory
  end

  def team_inventory
    {
      food: 0,
      parts: 0,
      work: 0
    }
  end

  def information
    @information
  end

  def events
    @events
  end

  def add_event event
    @events.push event
  end

  def uuid
    @uuid
  end

  def name
    @name
  end

  def status
    @status
  end

  def alive?
    @status == :alive
  end
  
  def tomb
    @tomb
  end

  def kill
    @status = :dead
  end

  def crash
    @status = :crashed
  end

  def ia_kill
    @status = :killed
  end

  def escape
    @status = :escaped
  end

  def trap
    @status = :trapped
  end

  def radiate
    @status = :radiated
  end

  def explode
    @status = :exploded
  end

  def escaped?
    @status == :escaped
  end

  def trapped?
    @status == :trapped
  end

  def to_h
    {
      uuid: uuid,
      name: name,
      status: status,
      inventory: inventory.to_h
    }
  end

  def action_at slot
    actions.select{ |the_action| the_action.slot == slot}.first
  end
end
