require 'test_helper'

class DrawingControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get drawing_index_url
    assert_response :success
  end

  test "should get create" do
    get drawing_create_url
    assert_response :success
  end

  test "should get destroy" do
    get drawing_destroy_url
    assert_response :success
  end

end
