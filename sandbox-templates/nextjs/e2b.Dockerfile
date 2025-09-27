# Node.js ka version 21 slim image use kar rahe hain as base - lightweight aur fast
FROM node:21-slim

# System update karte hain aur curl install karte hain for HTTP requests
# Clean up bhi kar rahe hain to reduce image size aur cache files remove karte hain
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Custom script ko container mein copy kar rahe hain jo probably page compilation ke liye hai
COPY compile_page.sh /compile_page.sh

# Script ko executable permission de rahe hain taki run ho sake
RUN chmod +x /compile_page.sh

# Working directory set kar rahe hain jahan saara Next.js setup hoga
WORKDIR /home/user/nextjs-app

# Next.js ka latest stable version (15.3.3) create kar rahe hain current directory mein
# --yes flag se saare prompts automatically accept ho jaate hain without manual input
RUN npx --yes create-next-app@15.3.3 . --yes

# Shadcn UI library initialize kar rahe hain with neutral theme
# --force flag se existing files overwrite ho jaati hain agar already present hain
RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force

# Shadcn ke saare available components install kar rahe hain ek saath
# --all flag se complete component library add ho jaati hai project mein
RUN npx --yes shadcn@2.6.3 add --all --yes

# Saare Next.js files ko parent directory (/home/user/) mein move kar rahe hain
# Aur empty nextjs-app folder delete kar rahe hain for clean structure
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app
