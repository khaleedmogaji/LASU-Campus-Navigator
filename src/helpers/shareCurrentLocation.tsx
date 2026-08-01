type UserLocation = [number, number] | null;

interface CurrentLocationProps {
  userLocation: UserLocation;
}

export const shareCurrentLocation = async ({
  userLocation,
}: CurrentLocationProps) => {
  if (!userLocation) {
    alert("Please enable your location to share it.");
    return;
  }
  const shareData = {
    title: "My Location at LASU",
    text: `Check out my current location at LASU: ${userLocation[0]}, ${userLocation[1]}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(
        `My Location at LASU: ${userLocation[0]}, ${userLocation[1]} - ${window.location.href}`,
      );
      alert("Location link copied to clipboard!");
    }
  } catch (err) {
    console.error("Error sharing:", err);
  }
};
