#!/bin/bash

# Yeh script sandbox template build karte waqt run hoti hai
# Ye make sure karti hai ki Next.js app (1) properly running hai aur (2) root page compile ho gaya hai

# Function jo server ko ping karti hai aur check karti hai ki properly start hua hai ya nahi
function ping_server() {
    # Counter initialize kar rahe hain for tracking attempts
    counter=0

    # localhost:3000 pe HTTP request bhejte hain aur sirf status code lete hain (200 = success)
    # -s = silent mode (no progress bar), -o /dev/null = output discard, -w = write format
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")

    # Jab tak response 200 (OK) nahi milta, tab tak loop chalate rahenge
    while [[ ${response} -ne 200 ]]; do
        # Har attempt pe counter badhate hain
        let counter++

        # Har 20th attempt pe message print karte hain taki user ko pata chale ki wait kar rahe hain
        if  (( counter % 20 == 0 )); then
            echo "Waiting for server to start..."
            # 0.1 second wait karte hain before next attempt
            sleep 0.1
        fi

        # Phir se server ko ping karte hain aur response check karte hain
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
    done
}

# ping_server function ko background mein start karte hain (&)
# Yeh parallel chalega main process ke saath
ping_server &

# User directory mein jaate hain aur Next.js development server start karte hain
# --turbopack flag use kar rahe hain for faster compilation (Turbopack is Next.js ka fast bundler)
cd /home/user && npx next dev --turbopack
