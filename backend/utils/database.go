package utils

import (
	"log"
	"os"
	"techmart-platform/models"

	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	
	// Get database configuration from environment
	dbType := os.Getenv("DB_TYPE")
	if dbType == "" {
		dbType = "sqlite"
	}
	
	// Force use the new database name
	dbName := "techmart.db"
	
	// Initialize database based on type
	if dbType == "sqlite" {
		DB, err = gorm.Open(sqlite.Open(dbName), &gorm.Config{
			DisableForeignKeyConstraintWhenMigrating: true,
		})
	} else {
		// For future PostgreSQL support
		log.Fatal("Only SQLite is currently supported")
	}
	
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate the schema
	err = DB.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Seed initial data
	seedData()
}

func seedData() {
	// Check if users already exist
	var userCount int64
	DB.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		// Create demo user
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("techmart123"), bcrypt.DefaultCost)
		demoUser := models.User{
			Username: "admin",
			Password: string(hashedPassword),
		}
		DB.Create(&demoUser)
		log.Println("Demo user created: admin / techmart123")
	}

	// Always recreate items for fresh data
	DB.Exec("DELETE FROM items")
	
	// Seed items
	items := []models.Item{
		{
			Name:        "Quantum Gaming Laptop",
			Description: "Next-generation gaming laptop with RTX 4080, 32GB RAM, and 1TB NVMe SSD for ultimate performance",
			Price:       2499.99,
			Category:    "Electronics",
			Rating:      4.9,
			Reviews:     2156,
			Image:       "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
			InStock:     true,
		},
		{
			Name:        "Smart Fitness Tracker Pro",
			Description: "Advanced health monitoring with ECG, blood oxygen, sleep tracking, and 14-day battery life",
			Price:       349.99,
			Category:    "Electronics",
			Rating:      4.7,
			Reviews:     1247,
			Image:       "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=300&fit=crop",
			InStock:     true,
		},
		{
			Name:        "Ergonomic Gaming Chair Elite",
			Description: "Premium gaming chair with 4D armrests, lumbar support, and memory foam cushion for extended sessions",
			Price:       599.99,
			Category:    "Furniture",
			Rating:      4.8,
			Reviews:     892,
			Image:       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
			InStock:     true,
		},
		{
			Name:        "Artisan Coffee Blend",
			Description: "Premium single-origin coffee beans from Ethiopian highlands with notes of citrus and chocolate",
			Price:       34.99,
			Category:    "Food & Beverages",
			Rating:      4.9,
			Reviews:     3421,
			Image:       "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
			InStock:     true,
		},
		{
			Name:        "Professional Studio Monitor",
			Description: "High-fidelity studio monitor with flat frequency response for accurate audio production",
			Price:       1299.99,
			Category:    "Electronics",
			Rating:      4.9,
			Reviews:     678,
			Image:       "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop",
			InStock:     true,
		},
		{
			Name:        "Smart Home Hub",
			Description: "Centralized smart home control with voice assistant, security monitoring, and IoT device management",
			Price:       199.99,
			Category:    "Electronics",
			Rating:      4.6,
			Reviews:     945,
			Image:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
			InStock:     true,
		},
		{
			Name:        "Wireless Noise-Canceling Headphones",
			Description: "Premium over-ear headphones with active noise cancellation and 40-hour battery life",
			Price:       449.99,
			Category:    "Electronics",
			Rating:      4.8,
			Reviews:     1567,
			Image:       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
			InStock:     true,
		},
		{
			Name:        "Mechanical Gaming Keyboard",
			Description: "RGB mechanical keyboard with Cherry MX switches, programmable macros, and wrist rest",
			Price:       179.99,
			Category:    "Electronics",
			Rating:      4.7,
			Reviews:     1123,
			Image:       "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
			InStock:     true,
		},
	}

	for _, item := range items {
		DB.Create(&item)
	}

	log.Println("TechMart database seeded successfully")
} 