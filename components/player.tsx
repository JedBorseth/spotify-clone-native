import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, Button, Pressable, Image } from "react-native";
import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import TrackPlayer, {
  Capability,
  useProgress,
} from "react-native-track-player";
import { Link } from "expo-router";
import { ProgressBar } from "react-native-paper";

export const Player = () => {
  useEffect(() => {
    const setupPlayer = async () => {
      TrackPlayer.setupPlayer().then(async () => {
        TrackPlayer.registerPlaybackService(() => require("../app/service"));
        TrackPlayer.updateOptions({
          // Media controls capabilities
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],

          // Capabilities that will show up when the notification is in the compact form on Android
          compactCapabilities: [Capability.Play, Capability.Pause],
        });

        TrackPlayer.addEventListener<any>("playback-state", (e) => {
          setPlayerState(e.state);
        });
        TrackPlayer.addEventListener<any>(
          "playback-active-track-changed",
          (e) => {
            setPlayerData(e);
          }
        );
        await TrackPlayer.add({
          id: "trackId",
          url: require("../assets/Hello.mp3"),
          title: "Local Test Song",
          artist: "Kid Cudi",
          artwork: require("../assets/images/album.png"),
        });
      });
    };
    setupPlayer();
  }, []);
  type PlayerDataType = {
    index: number;
    lastPosition: number;
    track: {
      artist: string;
      artwork: string;
      id: string;
      title: string;
      url: string;
    };
  };
  const progress = useProgress(1000);
  useEffect(() => {
    // ensure no division by zero
    if (progress.position && progress.duration)
      setProgressState(Number(progress.position / progress.duration));
  }, [progress]);

  const [playerData, setPlayerData] = useState<PlayerDataType>();
  const [playerState, setPlayerState] = useState<string>("not loaded");
  const [isPlaying, setIsPlaying] = useState(playerState === "playing");
  const [progressState, setProgressState] = useState(0);
  return (
    <View style={styles.playerContainer}>
      <View
        style={{
          paddingHorizontal: 30,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          gap: 25,
        }}
      >
        <View style={{ flexWrap: "wrap", gap: 10, maxHeight: 45 }}>
          <Image
            source={{ uri: playerData?.track.artwork }}
            style={{ width: 30, height: 30, borderRadius: 5 }}
          />
          <View style={{ height: "100%" }}>
            <Text style={{ color: "white" }}>{playerData?.track.title}</Text>
            <Text style={{ color: "#cbd5e1" }}>{playerData?.track.artist}</Text>
          </View>
        </View>
        <Pressable
          style={{ zIndex: 100 }}
          onPress={async () => {
            if (playerState === "playing") {
              await TrackPlayer.pause();
            } else {
              await TrackPlayer.play();
            }
          }}
        >
          <FontAwesome
            name={playerState === "playing" ? "pause" : "play"}
            size={24}
            color="white"
          />
        </Pressable>
      </View>
      <ProgressBar
        hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
        onTouchStart={(e) => {
          e.stopPropagation();
          const width = 410;
          const percent = (e.nativeEvent.locationX - 20) / width;
          const newPosition = percent * progress.duration;
          setProgressState(percent);
          TrackPlayer.seekTo(newPosition);
        }}
        style={{
          height: 2,
          backgroundColor: "#ffffff22",
          width: "90%",
          alignSelf: "center",
        }}
        color="white"
        progress={progressState}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  playerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 10,
    borderColor: Colors.green.text,
    borderTopWidth: 1,
  },
  playerText: {
    color: "white",
  },
});
