import { gapi } from "gapi-script";

function GetPlaylistItems(maxResults = 25, API_KEY, playlistId) {
  let request = gapi.client.request({
    method: "GET",
    path: "/youtube/v3/playlistItems",
    params: {
      maxResults: maxResults,
      part: "snippet,contentDetails",
      playlistId: playlistId,
      key: API_KEY,
    },
  });

  return request;
}

export const GetChannelInformation = (channelName, accessToken) => {
  let client = gapi.client.youtube.channels.list({
    part: "snippet,contentDetails",
    forUsername: "GoogleDevelopers",
    key: "AIzaSyDA2jbNb0OsXstzhLkyXXGtRqKT895N3PI",
    mine: true,
  });
  console.log("client: " + JSON.stringify(client));

  //   fetch(
  //     `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forUsername=${channelName}&mine=true`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((response) => {
  //       console.log("Rsp: " + JSON.stringify(response));
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Channel Data:", data);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });

  // let client=gapi.client.
  //   const accessToken =
  //     "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY3MTk2NzgzNTFhNWZhZWRjMmU3MDI3NGJiZWE2MmRhMmE4YzRhMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA3MDY4MjgwNjg5Ny12ZTNzdmg2ZjFzZ2hlMmZwYmVybnA4aWdkanZpbHE1aC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwNzA2ODI4MDY4OTctdmUzc3ZoNmYxc2doZTJmcGJlcm5wOGlnZGp2aWxxNWguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTY4NjUyNzk3NTQ2MjY3NTc1ODEiLCJlbWFpbCI6ImFiaGlsYXNoc3Rvcm1AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiI2WXZEb1ZnUy1CZHB5Qlg0b1ZSWnVRIiwibmJmIjoxNzE3MDUxOTAxLCJuYW1lIjoiQWJoaWxhc2ggVFUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSnJvQnhBUVo4WUxzLWlWX050d3o3SWVNWWIwbGd4NEZUZ1cwdG5kb0tTRURMUnE0TDlHZz1zOTYtYyIsImdpdmVuX25hbWUiOiJBYmhpbGFzaCIsImZhbWlseV9uYW1lIjoiVFUiLCJpYXQiOjE3MTcwNTIyMDEsImV4cCI6MTcxNzA1NTgwMSwianRpIjoiN2RmZjY4ZWFjMDE3YjlkMjM1YmFhOTg1OWJjYmUyNzU2M2ZjNWMzNiJ9.EtIudvMC1_fqwOCdIG5UwIR4r8-zelecYpJnp9M29cXWcB_VbtE07-Ys5oW-Ixkj03ajQmWRE2Zd-ZLkVC65jvFgPSP3gQyFohfFSr3uc4DPXz9wcCRJs9Y9WvG5wo_vDisFEq-qeH7bemta6LXZgijloSrC-KCtl0UBOLNe-4305D-DPCOLjDeoWm4yTVfK--eVzPJ4945eU2mvnSAEt613k0CJFDaqFWrEtCblOHfNz4YeSUMAGb12jG2DzASEVWMnm0L6Qn-TVFdSNyNUxudEE212crW88fl86xhAjLO5FxUMcDxKiy2NgJqcti0_-AcnLOk-PUt_rXVdzjCJFw";
  //   //   const channelName = "CHANNEL_USERNAME";

  //   fetch(
  //     `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forUsername=${channelName}&mine=true`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Channel Data:", data);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });

  return {};
};

function requestVideoPlaylist(playlistId, maxResults = 0) {
  gapi.client.youtube.playlistItems
    .list({
      playlistId: playlistId,
      part: "snippet",
      maxResults: maxResults,
    })
    .then((response) => {
      const playlistItems = response.result.items;
      console.log("Playlist", playlistItems);
    })
    .catch((err) => alert("Request Cant Accepted"));
}
