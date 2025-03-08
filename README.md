# song2fa

This app allows users to create a playlist, shuffle it, and authenticate their sequence by selecting the songs in the correct shuffled order. The app integrates with the Spotify API to search for songs and adds them to the playlist. Users can then authenticate by selecting the songs in the shuffled order they initially set.

## Features

- Search for Songs: Search for songs from the Spotify database by typing a query.
- Create Playlist: Add songs from the search results to your playlist.
- Drag-and-Drop: Reorder the songs in your playlist by dragging them.
- Shuffle Playlist: Shuffle your playlist and store the shuffled order for authentication.
- Authentication: Try to select the songs in the same order as the shuffled playlist to authenticate successfully.
- Reset: Clear the playlist and authentication data.

## Technologies Used

- React: The app is built using React for building the user interface.
- React DnD: Drag-and-drop functionality is implemented using the react-dnd library.
- Spotify API: The app fetches song data from the Spotify API to allow users to search for songs and create a playlist.
- CSS: The app uses custom CSS for styling.

## Prerequisites

Before running the app, ensure you have the following:

- A Spotify Developer account.
- A Spotify Client ID and Client Secret to authenticate requests to the Spotify API.

## Getting Started

1. Go to the app directory and install the required dependencies using npm

```
cd custom-song2fa
npm install
```

2. Set up Spotify API Credentials

You need to add your Spotify Client ID and Client Secret to the .env file for the app to authenticate with the Spotify API.

Create a .env file in the root of the project and add the following variables:

```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

3. Start the app

```
npm run dev
```

This will start the development server and open the app in your browser at http://localhost:5173/

## How to Use the App

1. Start by typing a song name in the search bar. Once the results are displayed, click on the "+" button to add songs to your playlist.

2. Drag and drop the songs in the order you want them in your playlist.

3. After you're done setting up the playlist, hit "Save Sequence" to save the order. This will shuffle your playlist.

4. In the authentication mode, click the songs in the correct shuffled order to authenticate. If you select the songs in the correct order, you'll be authenticated successfully.

5. If you'd like to start over, click the "Reset" button to clear the playlist and authentication data.
