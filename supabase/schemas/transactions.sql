CREATE SCHEMA transactions;

-- Expose schema
GRANT USAGE ON SCHEMA transactions TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA transactions TO anon, authenticated, service_role;

GRANT ALL ON ALL ROUTINES IN SCHEMA transactions TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA transactions TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA transactions GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA transactions GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA transactions GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

CREATE TABLE transactions.transactions (
    id serial PRIMARY KEY,
    buyer_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
    seller_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
    listing_id int NOT NULL,
    listing_category listings.category_type NOT NULL,
    FOREIGN KEY (listing_id, listing_category) REFERENCES listings.listings (id, category),
    amount DECIMAL(10, 2) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION transactions.purchase (listing_id int, listing_category listings.category_type)
    RETURNS void
    AS $$
DECLARE
    buyer_id uuid;
    listing_seller_id uuid;
    listing_stock int;
    listing_price DECIMAL(10, 2);
BEGIN
    BEGIN
        SELECT
            auth.uid () INTO buyer_id;
        IF buyer_id IS NULL THEN
            RAISE EXCEPTION 'Buyer not found';
        END IF;
        SELECT
            seller_id,
            stock,
            price INTO listing_seller_id,
            listing_stock,
            listing_price
        FROM
            listings.listings
        WHERE
            id = listing_id
            AND category = listing_category;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Listing not found';
        END IF;
        IF listing_stock <= 0 THEN
            RAISE EXCEPTION 'Listing is out of stock';
        END IF;
        -- Deduct the amount from the buyer's balance
        UPDATE
            profiles
        SET
            balance = balance - listing_price
        WHERE
            id = buyer_id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Buyer not found';
        END IF;
        IF (
            SELECT
                balance
            FROM
                profiles
            WHERE
                id = buyer_id) < 0 THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
        -- Add the amount to the seller's balance
        UPDATE
            profiles
        SET
            balance = balance + listing_price
        WHERE
            id = listing_seller_id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Seller not found';
        END IF;
        -- Update the stock of the listing
        UPDATE
            listings.listings
        SET
            stock = stock - 1
        WHERE
            id = listing_id
            AND category = listing_category;
        INSERT INTO transactions.transactions (buyer_id, seller_id, listing_id, listing_category, amount)
            VALUES (buyer_id, listing_seller_id, listing_id, listing_category, listing_price);
    EXCEPTION
        WHEN OTHERS THEN
            RAISE;
    END;
END;

$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- Only authenticated users can execute the purchase function
REVOKE EXECUTE ON FUNCTION transactions.purchase FROM public;

REVOKE EXECUTE ON FUNCTION transactions.purchase FROM anon;

CREATE TABLE transactions.deposits (
    id serial PRIMARY KEY,
    user_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION transactions.deposit (amount DECIMAL(10, 2))
    RETURNS DECIMAL (
        10, 2)
    LANGUAGE sql
    AS $$
    UPDATE
        profiles
    SET
        balance = balance + amount
    WHERE
        id = (
            SELECT
                auth.uid ())
    RETURNING
        balance;
$$;

CREATE FUNCTION transactions.best_selling_ID()
    RETURNS TABLE(ID INT, title TEXT, category TEXT)
    LANGUAGE plpgsql
    AS $$
    DECLARE
    BEGIN
        RETURN QUERY
        SELECT
            -- get top 1 values, this can be changes
            l.id,
            l.title,
            l.seller_id,
            l.category
        FROM
            listings.listings l
        WHERE l.id=(
            SELECT 
                listing_id,
            FROM
                transactions.transactions
            GROUP BY
                listing_id
            ORDER BY
                COUNT(listing_id) DESC
            LIMIT 1
        );
    END;    
$$;

