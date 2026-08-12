const pool = require('./database');

const seedCampaigns = [
    {
        title: 'Education for All',
        description: 'Provide education to underprivileged children.',
        target_amount: 100000,
        collected_amount: 50000,
        days_left: 30,
        image: '/images/campaigns/education.png'
    },
    {
        title: 'Clean Water for Village',
        description: 'Provide clean drinking water to a village.',
        target_amount: 50000,
        collected_amount: 25000,
        days_left: 45,
        image: '/images/campaigns/water.png'
    },
    {
        title: 'Help a Child Fight Cancer',
        description: 'Support medical treatment for a child battling cancer.',
        target_amount: 500000,
        collected_amount: 325000,
        days_left: 18,
        image: '/images/campaigns/healthcare.png'
    },
    {
        title: 'Support Rural Healthcare',
        description: 'Help establish essential healthcare facilities in a rural community.',
        target_amount: 300000,
        collected_amount: 145000,
        days_left: 25,
        image: '/images/campaigns/hospital.png'
    },
    {
        title: 'Feed 100 Families',
        description: 'Provide essential groceries and meals to families facing financial hardship.',
        target_amount: 150000,
        collected_amount: 92000,
        days_left: 12,
        image: '/images/campaigns/food.png'
    },
    {
        title: 'Books for Rural Schools',
        description: 'Provide books and educational materials to students in rural schools.',
        target_amount: 80000,
        collected_amount: 42000,
        days_left: 35,
        image: '/images/campaigns/books.png'
    },
    {
        title: 'Emergency Flood Relief',
        description: 'Provide food, clothing and essential supplies to families affected by floods.',
        target_amount: 250000,
        collected_amount: 187500,
        days_left: 8,
        image: '/images/campaigns/flood.png'
    },
    {
        title: 'Help Build a Community Library',
        description: 'Build a small community library and create a better learning environment for children.',
        target_amount: 200000,
        collected_amount: 75000,
        days_left: 50,
        image: '/images/campaigns/library.png'
    },
    {
        title: 'Support Children with Disabilities',
        description: 'Provide therapy, education and essential equipment for children with disabilities.',
        target_amount: 400000,
        collected_amount: 210000,
        days_left: 22,
        image: '/images/campaigns/children.png'
    },
    {
        title: 'Animal Rescue and Care',
        description: 'Support rescue, medical treatment and food for abandoned animals.',
        target_amount: 120000,
        collected_amount: 68000,
        days_left: 28,
        image: '/images/campaigns/animals.png'
    },
    {
        title: 'Help a Farmer Recover',
        description: 'Support a farmer recovering from crop loss and unexpected financial hardship.',
        target_amount: 175000,
        collected_amount: 89000,
        days_left: 20,
        image: '/images/campaigns/farmer.png'
    },
    {
        title: 'Scholarships for Students',
        description: 'Provide financial assistance to talented students from low-income families.',
        target_amount: 350000,
        collected_amount: 275000,
        days_left: 15,
        image: '/images/campaigns/students.png'
    },
    {
        title: 'Women Skill Development',
        description: 'Help women learn vocational skills and become financially independent.',
        target_amount: 180000,
        collected_amount: 96000,
        days_left: 40,
        image: '/images/campaigns/women.png'
    },
    {
        title: 'Rebuild After Fire',
        description: 'Help a family rebuild their home and replace essential belongings after a fire.',
        target_amount: 275000,
        collected_amount: 163000,
        days_left: 17,
        image: '/images/campaigns/home.png'
    }
];

async function initDb() {
    try {
        console.log('Initializing database tables...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS campaigns (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                target_amount NUMERIC NOT NULL,
                collected_amount NUMERIC DEFAULT 0,
                days_left INT DEFAULT 30,
                image TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS donations (
                id SERIAL PRIMARY KEY,
                campaign_id INT REFERENCES campaigns(id) ON DELETE CASCADE,
                user_id INT REFERENCES users(id) ON DELETE SET NULL,
                amount NUMERIC NOT NULL,
                donor_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const countResult = await pool.query('SELECT COUNT(*) FROM campaigns');
        const count = parseInt(countResult.rows[0].count, 10);

        if (count === 0) {
            console.log('Seeding initial campaigns into PostgreSQL...');
            for (const camp of seedCampaigns) {
                await pool.query(
                    `INSERT INTO campaigns (title, description, target_amount, collected_amount, days_left, image)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [camp.title, camp.description, camp.target_amount, camp.collected_amount, camp.days_left, camp.image]
                );
            }
            console.log('Campaigns seeded successfully.');
        }

        console.log('Database initialization completed.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

module.exports = initDb;
