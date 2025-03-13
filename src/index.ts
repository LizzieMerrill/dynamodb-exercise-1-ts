import { FollowsDAO, Follow } from "./FollowsDAO";

async function main() {
  const dao = new FollowsDAO();

  // Constants for our common attributes
  const commonFollowerHandle = "@FredFlintstone";
  const commonFollowerName = "Fred Flintstone";
  const commonFolloweeHandle = "@ClintEastwood";
  const commonFolloweeName = "Clint Eastwood";

  // ----------------------------------------------------
  // 1. Insert 25 follow items with the same follower
  // ----------------------------------------------------
  console.log("Putting 25 items with the same follower...");
  for (let i = 1; i <= 25; i++) {
    // Make followee attributes unique for each item
    const follow: Follow = {
      follower_handle: commonFollowerHandle,
      follower_name: commonFollowerName,
      followee_handle: `${commonFolloweeHandle}_${i}`, // e.g., "@ClintEastwood_1"
      followee_name: `${commonFolloweeName} ${i}`,       // e.g., "Clint Eastwood 1"
    };
    await dao.putFollow(follow);
    console.log(
      `Put item: follower=${commonFollowerHandle}, followee=${follow.followee_handle}`
    );
  }

  // ----------------------------------------------------
  // 2. Insert 25 follow items with the same followee
  // ----------------------------------------------------
  console.log("Putting 25 items with the same followee...");
  for (let i = 1; i <= 25; i++) {
    // Make follower attributes unique for each item
    const follow: Follow = {
      follower_handle: `${commonFollowerHandle}_${i}`, // e.g., "@FredFlintstone_1"
      follower_name: `${commonFollowerName} ${i}`,       // e.g., "Fred Flintstone 1"
      followee_handle: commonFolloweeHandle,
      followee_name: commonFolloweeName,
    };
    await dao.putFollow(follow);
    console.log(
      `Put item: follower=${follow.follower_handle}, followee=${commonFolloweeHandle}`
    );
  }

  // ----------------------------------------------------
  // 3. Get one item using its primary key
  // ----------------------------------------------------
  console.log("Getting one item using primary key...");
  // For example, get the first item from the first batch
  const keyFollower = commonFollowerHandle;
  const keyFollowee = `${commonFolloweeHandle}_1`;
  const retrievedFollow = await dao.getFollow(keyFollower, keyFollowee);
  console.log("Retrieved item:", retrievedFollow);

  // ----------------------------------------------------
  // 4. Update the follower_name and followee_name attributes
  // ----------------------------------------------------
  console.log("Updating the retrieved item...");
  await dao.updateFollowNames(
    keyFollower,
    keyFollowee,
    "Updated Fred",
    "Updated Clint"
  );
  const updatedFollow = await dao.getFollow(keyFollower, keyFollowee);
  console.log("Updated item:", updatedFollow);

  // ----------------------------------------------------
  // 5. Delete one item using its primary key
  // ----------------------------------------------------
  console.log("Deleting one item using primary key...");
  // For example, delete one of the items from the second batch, say the one with follower handle "@FredFlintstone_1"
  await dao.deleteFollow(`${commonFollowerHandle}_1`, commonFolloweeHandle);
  console.log(
    `Deleted item: follower=${commonFollowerHandle}_1, followee=${commonFolloweeHandle}`
  );
}

main().catch((err) => {
  console.error("Error executing main function:", err);
});
