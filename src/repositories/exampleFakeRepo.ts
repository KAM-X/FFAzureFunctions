import { TestMessage } from "../models/testMessage";

export interface IMessageRepository {
  save(msg: TestMessage): Promise<void>;
  getAll(): Promise<TestMessage[]>;
}

export class FakeMessageRepository implements IMessageRepository {
  private messages: TestMessage[] = [];

  public async save(msg: TestMessage): Promise<void> {
    // predent this saves to a database
    this.messages.push(msg);
  }

  public async getAll(): Promise<TestMessage[]> {
    // pretend this gets all messages from a database
    const dummyMessages: TestMessage[] = [
      { name: "John", message: "Hello, John!" },
      { name: "Jane", message: "Hello, Jane!" },
      { name: "Joe", message: "Hello, Joe!" },
    ];
    return this.messages.length > 0 ? this.messages : dummyMessages;
  }
}