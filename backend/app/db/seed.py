from app.db.session import SessionLocal
from app.models.product import Category, Product

def seed_data():
    db = SessionLocal()
    try:
        if db.query(Category).count() == 0:
            print("Seeding Categories...")
            cat_action = Category(name="Action Toys", slug="action-toys")
            cat_edu = Category(name="Educational Toys", slug="educational-toys")
            
            db.add_all([cat_action, cat_edu])
            db.commit()

            # Pass the auto-generated integer IDs to the products
            db.refresh(cat_action)
            db.refresh(cat_edu)

            print("Seeding Products...")
            product1 = Product(
                category_id=cat_action.id,
                name="AI Super Robot",
                slug="ai-super-robot",
                description="Interactive smart robot for kids.",
                price=8500.00,
                stock=15,
                is_featured=True
            )
            product2 = Product(
                category_id=cat_edu.id,
                name="Smart Building Blocks",
                slug="smart-building-blocks",
                description="100-piece STEM learning block set.",
                price=4200.00,
                stock=30,
                is_featured=True
            )
            
            db.add_all([product1, product2])
            db.commit()
            print("Data Seeding Complete Successfully!")
        else:
            print("Database already contains data. Skipping seed.")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()