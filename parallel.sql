CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE
    IF NOT EXISTS auth.users (
        id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE SCHEMA IF NOT EXISTS products;

CREATE SCHEMA IF NOT EXISTS orders;

CREATE SCHEMA IF NOT EXISTS transactions;

-- Products schema
CREATE TABLE
    IF NOT EXISTS products.products (
        id SERIAL,
        vendor_id UUID NOT NULL, -- Changed to UUID to match auth.users.id
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (vendor_id) REFERENCES auth.users (id) ON DELETE CASCADE
    )
PARTITION BY
    hash (id);

-- Products Table Partitions
CREATE TABLE
    products.products_0 PARTITION OF products.products FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 0);

CREATE TABLE
    products.products_1 PARTITION OF products.products FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 1);

CREATE TABLE
    products.products_2 PARTITION OF products.products FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 2);

-- Categories Table
CREATE TABLE
    IF NOT EXISTS products.categories (
        id SERIAL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT TRUE,
        PRIMARY KEY (id)
    )
PARTITION BY
    hash (id);

-- Categories Table Partitions
CREATE TABLE
    products.categories_0 PARTITION OF products.categories FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 0);

CREATE TABLE
    products.categories_1 PARTITION OF products.categories FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 1);

CREATE TABLE
    products.categories_2 PARTITION OF products.categories FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 2);

-- product_categories table to establish many-to-many relationship
CREATE TABLE
    IF NOT EXISTS products.product_categories (
        product_id INT NOT NULL,
        category_id INT NOT NULL,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products.products (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES products.categories (id) ON DELETE CASCADE
    )
PARTITION BY
    hash (product_id);

-- Product Categories Table Partitions
CREATE TABLE
    products.product_categories_0 PARTITION OF products.product_categories FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 0);

CREATE TABLE
    products.product_categories_1 PARTITION OF products.product_categories FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 1);

CREATE TABLE
    products.product_categories_2 PARTITION OF products.product_categories FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 2);

-- Product inventory Table - Fixed primary key issue
CREATE TABLE
    IF NOT EXISTS products.product_inventory (
        id SERIAL,
        product_id INT NOT NULL,
        quantity INT NOT NULL CHECK (quantity >= 0),
        action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('restock', 'sold', 'adjustment','damaged','new')),
        location VARCHAR(255) DEFAULT 'WAREHOUSE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id UUID NOT NULL, -- Changed to UUID
        PRIMARY KEY (id), -- Include partition key in primary key
        FOREIGN KEY (product_id) REFERENCES products.products (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
    )
PARTITION BY
    hash (id);

-- Product Inventory Table Partitions
CREATE TABLE
    products.product_inventory_0 PARTITION OF products.product_inventory FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 0);

CREATE TABLE
    products.product_inventory_1 PARTITION OF products.product_inventory FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 1);

CREATE TABLE
    products.product_inventory_2 PARTITION OF products.product_inventory FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 2);

-- Orders Table
CREATE TABLE
    IF NOT EXISTS orders.orders (
        id SERIAL,
        buyer_id UUID NOT NULL, -- Changed to UUID
        total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
        status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (buyer_id) REFERENCES auth.users (id) ON DELETE CASCADE
    )
PARTITION BY
    hash (id);

-- Orders Table Partitions
CREATE TABLE
    orders.orders_0 PARTITION OF orders.orders FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 0);

CREATE TABLE
    orders.orders_1 PARTITION OF orders.orders FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 1);

CREATE TABLE
    orders.orders_2 PARTITION OF orders.orders FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 2);

-- Order Items Table
CREATE TABLE
    IF NOT EXISTS orders.order_items (
        id SERIAL,
        quantity INT NOT NULL CHECK (quantity > 0),
        price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
        product_id INT NOT NULL,
        order_id INT NOT NULL,
        seller_id UUID NOT NULL, -- Changed to UUID
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES products.products (id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders.orders (id) ON DELETE CASCADE,
        FOREIGN KEY (seller_id) REFERENCES auth.users (id) ON DELETE CASCADE
    )
PARTITION BY
    hash (id);

-- Order Items Table Partitions
CREATE TABLE
    orders.order_items_0 PARTITION OF orders.order_items FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 0);

CREATE TABLE
    orders.order_items_1 PARTITION OF orders.order_items FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 1);

CREATE TABLE
    orders.order_items_2 PARTITION OF orders.order_items FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 2);

-- Transactions Table
CREATE TABLE
    IF NOT EXISTS transactions.transactions (
        id SERIAL,
        user_id UUID NOT NULL, -- Changed to UUID
        amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
        type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'purchase', 'sale')),
        reference_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
        FOREIGN KEY (reference_id) REFERENCES orders.orders (id) ON DELETE CASCADE
    )
PARTITION BY
    hash (id);

-- Transaction Table Partitions
CREATE TABLE
    transactions.transactions_0 PARTITION OF transactions.transactions FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 0);

CREATE TABLE
    transactions.transactions_1 PARTITION OF transactions.transactions FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 1);

CREATE TABLE
    transactions.transactions_2 PARTITION OF transactions.transactions FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 2);

-- Product Reviews Table - Fixed missing comma
CREATE TABLE
    IF NOT EXISTS products.product_reviews (
        id SERIAL,
        product_id INT NOT NULL,
        user_id UUID NOT NULL, -- Changed to UUID
        order_id INT NOT NULL,
        rating INT CHECK (
            rating >= 1
            AND rating <= 5
        ),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id), -- Include partition key in primary key
        FOREIGN KEY (product_id) REFERENCES products.products (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE, -- Added comma here
        FOREIGN KEY (order_id) REFERENCES orders.orders (id) ON DELETE CASCADE
    )
PARTITION BY
    hash (id);

-- Product Reviews Table Partitions
CREATE TABLE
    products.product_reviews_0 PARTITION OF products.product_reviews FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 0);

CREATE TABLE
    products.product_reviews_1 PARTITION OF products.product_reviews FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 1);

CREATE TABLE
    products.product_reviews_2 PARTITION OF products.product_reviews FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 2);

--cart items table
CREATE TABLE
    IF NOT EXISTS orders.cart_items (
        id SERIAL,
        user_id UUID,
        product_id INT,
        quantity INT DEFAULT 1,
        PRIMARY KEY (id),
        FOREIGN KEY (product_id) REFERENCES products.products (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
    )
PARTITION BY
    HASH (id) --cart table partitions
CREATE TABLE
    orders.cart_items_0 PARTITION OF orders.cart_items FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 0);

CREATE TABLE
    orders.cart_items_1 PARTITION OF orders.cart_items FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 1);

CREATE TABLE
    orders.cart_items_2 PARTITION OF orders.cart_items FOR
VALUES
WITH
    (MODULUS 3, REMAINDER 2);


 

--trigger functions
/*
--client
add to cart
remove from cart
checkout
buy now

--vendor
add new product
deactivate product
reactivate product
remove product
update product details
update inventory (restock, sold, adjustment, damaged)
 */


 --client 
 CREATE OR REPLACE FUNCTION orders.add_to_cart(
    p_user_id UUID,
    p_product_id INT,
    p_quantity INT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO orders.cart_items (user_id, product_id, quantity)
    VALUES (p_user_id, p_product_id, p_quantity)
    ON CONFLICT (user_id, product_id) DO UPDATE
    SET quantity = orders.cart_items.quantity + EXCLUDED.quantity;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION orders.remove_from_cart(
    p_user_id UUID,
    p_product_id INT
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM orders.cart_items
    WHERE user_id = p_user_id AND product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION orders.checkout(
    p_user_id UUID
) RETURNS INT AS $$
DECLARE
    v_order_id INT;
    v_total_amount DECIMAL(10, 2) := 0;
    v_item_record RECORD;
    v_inventory_available BOOLEAN := TRUE;
    v_current_inventory INT;
BEGIN
    -- Check if user exists
    IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;
    
    -- Check if cart is empty
    IF NOT EXISTS(SELECT 1 FROM orders.cart_items WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'Cart is empty';
    END IF;
    
    -- Check inventory availability for all items
    FOR v_item_record IN 
        SELECT ci.product_id, ci.quantity, p.price, p.vendor_id 
        FROM orders.cart_items ci
        JOIN products.products p ON ci.product_id = p.id
        WHERE ci.user_id = p_user_id
    LOOP
        -- Check current inventory
        SELECT COALESCE(SUM(CASE WHEN action_type IN ('restock', 'new') THEN quantity
                          WHEN action_type IN ('sold', 'damaged') THEN -quantity
                          ELSE 0 END), 0)
        INTO v_current_inventory
        FROM products.product_inventory
        WHERE product_id = v_item_record.product_id;
        
        IF v_current_inventory < v_item_record.quantity THEN
            v_inventory_available := FALSE;
            RAISE EXCEPTION 'Not enough inventory for product ID %. Only % available', 
                            v_item_record.product_id, v_current_inventory;
        END IF;
        
        -- Add to total amount
        v_total_amount := v_total_amount + (v_item_record.price * v_item_record.quantity);
    END LOOP;
    
    -- Create the order
    INSERT INTO orders.orders (buyer_id, total_amount, status)
    VALUES (p_user_id, v_total_amount, 'pending')
    RETURNING id INTO v_order_id;
    
    -- Create order items
    INSERT INTO orders.order_items (order_id, product_id, quantity, price_at_purchase, seller_id)
    SELECT 
        v_order_id, 
        p.id, 
        ci.quantity, 
        p.price,
        p.vendor_id
    FROM orders.cart_items ci
    JOIN products.products p ON ci.product_id = p.id
    WHERE ci.user_id = p_user_id;
    
    -- Update inventory
    FOR v_item_record IN 
        SELECT product_id, quantity 
        FROM orders.cart_items 
        WHERE user_id = p_user_id
    LOOP
        -- Record the sale in product_inventory
        INSERT INTO products.product_inventory 
            (product_id, quantity, action_type, user_id)
        VALUES 
            (v_item_record.product_id, v_item_record.quantity, 'sold', p_user_id);
    END LOOP;
    
    -- Record transaction
    INSERT INTO transactions.transactions 
        (user_id, amount, type, reference_id)
    VALUES 
        (p_user_id, v_total_amount, 'purchase', v_order_id);
    
    -- Clear the cart
    DELETE FROM orders.cart_items WHERE user_id = p_user_id;
    
    -- Mark order as completed
    UPDATE orders.orders SET status = 'completed' WHERE id = v_order_id;
    
    RETURN v_order_id;
EXCEPTION
    WHEN OTHERS THEN
        -- If any error occurs, rollback will happen automatically
        RAISE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION orders.buy_now(
    p_user_id UUID,
    p_product_id INT,
    p_quantity INT DEFAULT 1
) RETURNS INT AS $$
DECLARE
    v_order_id INT;
    v_total_amount DECIMAL(10, 2);
    v_product_exists BOOLEAN;
    v_current_inventory INT;
    v_product_price DECIMAL(10, 2);
    v_vendor_id UUID;
BEGIN
    -- Check if user exists
    IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;
    
    -- Check if product exists
    SELECT 
        EXISTS(SELECT 1 FROM products.products WHERE id = p_product_id),
        p.price,
        p.vendor_id
    INTO v_product_exists, v_product_price, v_vendor_id
    FROM products.products p
    WHERE p.id = p_product_id;
    
    IF NOT v_product_exists THEN
        RAISE EXCEPTION 'Product does not exist';
    END IF;
    
    -- Check current inventory
    SELECT COALESCE(SUM(CASE WHEN action_type IN ('restock', 'new') THEN quantity
                      WHEN action_type IN ('sold', 'damaged') THEN -quantity
                      ELSE 0 END), 0)
    INTO v_current_inventory
    FROM products.product_inventory
    WHERE product_id = p_product_id;
    
    IF v_current_inventory < p_quantity THEN
        RAISE EXCEPTION 'Not enough inventory available. Only % items in stock', v_current_inventory;
    END IF;
    
    -- Calculate total amount
    v_total_amount := v_product_price * p_quantity;
    
    -- Create the order
    INSERT INTO orders.orders (buyer_id, total_amount, status)
    VALUES (p_user_id, v_total_amount, 'pending')
    RETURNING id INTO v_order_id;
    
    -- Create order item
    INSERT INTO orders.order_items (order_id, product_id, quantity, price_at_purchase, seller_id)
    VALUES (v_order_id, p_product_id, p_quantity, v_product_price, v_vendor_id);
    
    -- Record the sale in product_inventory
    INSERT INTO products.product_inventory 
        (product_id, quantity, action_type, user_id)
    VALUES 
        (p_product_id, p_quantity, 'sold', p_user_id);
    
    -- Record transaction
    INSERT INTO transactions.transactions 
        (user_id, amount, type, reference_id)
    VALUES 
        (p_user_id, v_total_amount, 'purchase', v_order_id);
    
    -- Mark order as completed
    UPDATE orders.orders SET status = 'completed' WHERE id = v_order_id;
    
    RETURN v_order_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;

--vendor
CREATE OR REPLACE FUNCTION products.add_product(
    p_vendor_id UUID,
    p_name VARCHAR(255),
    p_description TEXT,
    p_price DECIMAL(10, 2),
    p_image_url VARCHAR(255)
    P_quantity INT
) 
retURNS VOID AS $$
DECLARE
    new_product_id INT;
BEGIN
    INSERT INTO products.products (vendor_id, name, description, price, image_url)
    VALUES (p_vendor_id, p_name, p_description, p_price, p_image_url);
    RETURNING id into new_product_id;
    INSERT INTO products.product_inventory (product_id, quantity, action_type, user_id)
    VALUES (new_product_id, p_quantity, 'new', p_vendor_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION products.remove_product(
    p_product_id INT
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM products.products
    WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION products.update_product(
    p_product_id INT,
    p_name VARCHAR(255),
    p_description TEXT,
    p_price DECIMAL(10, 2),
    p_image_url VARCHAR(255)
)
RETURNS VOID AS $$
BEGIN
    UPDATE products.products
    SET name = p_name,
        description = p_description,
        price = p_price,
        image_url = p_image_url,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION products.update_inventory(
    p_product_id INT,
    p_quantity_change INT,
    p_action_type VARCHAR(20),
    p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
    -- Check if the action type is valid
    IF p_action_type NOT IN ('restock', 'sold', 'adjustment', 'damaged') THEN
        RAISE EXCEPTION 'Invalid action type: %', p_action_type;
    END IF;

    -- Update the inventory based on the action type
    UPDATE products.product_inventory
    SET quantity = quantity + p_quantity_change,
        action_type = p_action_type,
        updated_at = CURRENT_TIMESTAMP
    WHERE product_id = p_product_id AND action_type = p_action_type;

END;    
$$ LANGUAGE plpgsql;


