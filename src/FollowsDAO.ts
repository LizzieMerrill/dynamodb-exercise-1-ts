import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  
  /**
   * Represents a follow relationship.
   */
  export interface Follow {
    follower_handle: string; // Partition Key
    follower_name: string;
    followee_handle: string; // Sort Key
    followee_name: string;
  }
  
  /**
   * The FollowsDAO encapsulates all basic operations on the "follows" table.
   */
  export class FollowsDAO {
    private readonly tableName = "follows";
    private readonly client: DynamoDBDocumentClient;
  
    constructor() {
      // Create a DynamoDB client and wrap it with the DocumentClient for easier use
      const ddbClient = new DynamoDBClient({});
      this.client = DynamoDBDocumentClient.from(ddbClient);
    }
  
    /**
     * Put a follow item in the DynamoDB table.
     * @param follow - The follow relationship object.
     */
    async putFollow(follow: Follow): Promise<void> {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: follow,
      });
      await this.client.send(command);
    }
  
    /**
     * Get a single follow item using the primary key (follower_handle and followee_handle).
     * @param follower_handle - The handle of the follower (Partition Key).
     * @param followee_handle - The handle of the followee (Sort Key).
     * @returns The follow object or null if not found.
     */
    async getFollow(
      follower_handle: string,
      followee_handle: string
    ): Promise<Follow | null> {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { follower_handle, followee_handle },
      });
      const result = await this.client.send(command);
      return result.Item ? (result.Item as Follow) : null;
    }
  
    /**
     * Update the follower_name and followee_name attributes for a given follow item.
     * @param follower_handle - The handle of the follower.
     * @param followee_handle - The handle of the followee.
     * @param newFollowerName - The new name for the follower.
     * @param newFolloweeName - The new name for the followee.
     */
    async updateFollowNames(
      follower_handle: string,
      followee_handle: string,
      newFollowerName: string,
      newFolloweeName: string
    ): Promise<void> {
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { follower_handle, followee_handle },
        UpdateExpression: "set follower_name = :fName, followee_name = :feName",
        ExpressionAttributeValues: {
          ":fName": newFollowerName,
          ":feName": newFolloweeName,
        },
      });
      await this.client.send(command);
    }
  
    /**
     * Delete a follow item using its primary key.
     * @param follower_handle - The handle of the follower.
     * @param followee_handle - The handle of the followee.
     */
    async deleteFollow(
      follower_handle: string,
      followee_handle: string
    ): Promise<void> {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { follower_handle, followee_handle },
      });
      await this.client.send(command);
    }
  }
  