RSpec::Matchers.define :contain_partial_hash do |*expected|
  match do |*actual|
    return false unless check_hash expected, actual
    expected.flatten!
    actual.flatten!

    expected.all? { |expected_item|
      actual.any? { |actual_item|
        actual_item.merge(expected_item) == actual_item
      }
    }
  end

  failure_message do |actual|
    "expected that #{actual} would include #{expected}"
  end

  private
  def check_hash *params
    params.all? { |p|
      p.flatten.all?{ |e|
        e.is_a? Hash
      }
    }
  end
end
