class CreateDrawings < ActiveRecord::Migration[6.0]
  def change
    create_table :drawings do |t|
      t.string :title
      t.text :description
      t.string :image
      t.boolean :published
      t.integer :user_id

      t.timestamps
    end
  end
end
