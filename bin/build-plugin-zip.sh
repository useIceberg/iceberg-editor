#!/bin/bash

# Exit if any command fails.
set -e

# Change to the expected directory.
cd "$(dirname "$0")"
cd ..

# Enable nicer messaging for build status.
BLUE_BOLD='\033[1;34m';
GREEN_BOLD='\033[1;32m';
RED_BOLD='\033[1;31m';
YELLOW_BOLD='\033[1;33m';
COLOR_RESET='\033[0m';
error () {
	echo -e "\n${RED_BOLD}$1${COLOR_RESET}\n"
}
status () {
	echo -e "\n${BLUE_BOLD}$1${COLOR_RESET}\n"
}
success () {
	echo -e "\n${GREEN_BOLD}$1${COLOR_RESET}\n"
}
warning () {
	echo -e "\n${YELLOW_BOLD}$1${COLOR_RESET}\n"
}

status "Time to build Iceberg 🐧"

if [ -z "$NO_CHECKS" ]; then
	# Make sure there are no changes in the working tree. Release builds should be
	# traceable to a particular commit and reliably reproducible. (This is not
	# totally true at the moment because we download nightly vendor scripts).
	changed=
	if ! git diff --exit-code > /dev/null; then
		changed="file(s) modified"
	elif ! git diff --cached --exit-code > /dev/null; then
		changed="file(s) staged"
	fi
	if [ ! -z "$changed" ]; then
		git status
		error "ERROR: Cannot build plugin zip with dirty working tree. ☝️
		Commit your changes and try again."
		exit 1
	fi

	# Do a dry run of the repository reset. Prompting the user for a list of all
	# files that will be removed should prevent them from losing important files!
	status "Resetting the repository to pristine condition. ✨"
	to_clean=$(git clean -xdf --exclude="local.json" --dry-run)
	if [ ! -z "$to_clean" ]; then
		echo $to_clean
		warning "🚨 About to delete everything above! Is this okay? 🚨"
		echo -n "[y]es/[N]o: "
		read answer
		if [ "$answer" != "${answer#[Yy]}" ]; then
			# Remove ignored files to reset repository to pristine condition. Previous
			# test ensures that changed files abort the plugin build.
			status "Cleaning working directory... 🛀"
			git clean -xdf --exclude="local.json"
		else
			error "Fair enough; aborting. Tidy up your repo and try again. 🙂"
			exit 1
		fi
	fi
fi

# # Download all vendor scripts
# status "Downloading remote vendor scripts... 🛵"
# vendor_scripts=""
# # Using `command | while read...` is more typical, but the inside of the `while`
# # loop will run under a separate process this way, meaning that it cannot
# # modify $vendor_scripts. See: https://stackoverflow.com/a/16855194

# while IFS='|' read -u 3 url filename; do
# 	echo "$url"
# 	echo -n " > vendor/$filename ... "
# 	http_status=$( curl \
# 		--location \
# 		--silent \
# 		"$url" \
# 		--output "vendor/_download.tmp.js" \
# 		--write-out "%{http_code}"
# 	)
# 	if [ "$http_status" != 200 ]; then
# 		error "HTTP $http_status"
# 		exit 1
# 	fi
# 	mv -f "vendor/_download.tmp.js" "vendor/$filename"
# 	echo -e "${GREEN_BOLD}done!${COLOR_RESET}"
# 	vendor_scripts="$vendor_scripts vendor/$filename"
# done

# Run the build; generating translation files.
status "Installing dependencies..."
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install

status "Generating build and translation files... ⽒"
npm run build:assets

mkdir -p dist

# Temporarily modify `gutenberg.php` with production constants defined. Use a
# temp file because `bin/generate-gutenberg-php.php` reads from `gutenberg.php`
# so we need to avoid writing to that file at the same time.
# php bin/generate-gutenberg-php.php > gutenberg.tmp.php
# mv gutenberg.tmp.php gutenberg.php

build_files=$(ls build/*.{js,css,asset.php})

# Generate the plugin zip file.
status "Creating archive... 🤐"

zip -r ./dist/iceberg.zip \
	iceberg.php \
	includes \
	languages \
	$vendor_scripts \
	$build_files \
	readme.txt \
	changelog.txt

# Reset `iceberg.php`.
git checkout iceberg.php

# Unzip plugin zip file
unzip ./dist/iceberg.zip -d "./dist/iceberg/"

success "Done. You've built Iceberg! 🐧"
