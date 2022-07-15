package main

import (
	"database/sql"
)

type user struct {
    ID    int     `json:"id"`
    Email string  `json:"email"`
    Name  string  `json:"name"`
}

func (p *user) getUser(db *sql.DB) error {
	return db.QueryRow("SELECT name, email FROM users WHERE id=$1",p.ID).Scan(&p.Name, &p.Email)
}

func (p *user) updateUser(db *sql.DB) error {
	_, err := db.Exec("UPDATE users SET name=$1, email=$2 WHERE id=$3", p.Name, p.Email, p.ID)

	return err
}

func (p *user) deleteUser(db *sql.DB) error {
    _, err := db.Exec("DELETE FROM users WHERE id=$1", p.ID)

    return err
}

func (p *user) createUser(db *sql.DB) error {
	err := db.QueryRow("INSERT INTO users(name, email) VALUES($1, $2) RETURNING id", p.Name, p.Email).Scan(&p.ID)

    if err != nil {
        return err
    }

    return nil
}

func getUsers(db *sql.DB, start, count int) ([]user, error) {
	rows, err := db.Query(
        "SELECT id, name,  email FROM users LIMIT $1 OFFSET $2",
        count, start)

    if err != nil {
        return nil, err
    }

    defer rows.Close()

    users := []user{}

    for rows.Next() {
        var p user
        if err := rows.Scan(&p.ID, &p.Name, &p.Email); err != nil {
            return nil, err
        }
        users = append(users, p)
    }

    return users, nil
}