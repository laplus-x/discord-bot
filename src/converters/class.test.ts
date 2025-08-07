import { Expose } from "class-transformer";
import { describe, expect, it } from "vitest";
import { ClassConverter, TransformDate } from "./class";

class TestModel {
  @Expose({ name: "createdAt" })
  @TransformDate()
  createdAt: Date;

  constructor(createdAt: Date) {
    this.createdAt = createdAt;
  }
}

describe("ClassConverter", () => {
  it("should convert Date to ISO string", () => {
    // Given
    const model = new TestModel(new Date("2023-01-01T00:00:00.000Z"));

    // When
    const plain = ClassConverter.serialize(model);

    // Then
    expect(plain.createdAt).toEqual("2023-01-01T00:00:00.000Z");
  });

  it("should convert ISO string to Date", () => {
    // Given
    const plain = {
      createdAt: "2023-01-01T00:00:00.000Z",
    };

    // When
    const model = ClassConverter.deserialize(plain, TestModel);

    // Then
    expect(model).toBeInstanceOf(TestModel);
    expect(model.createdAt).toBeInstanceOf(Date);
    expect(model.createdAt.toISOString()).toBe("2023-01-01T00:00:00.000Z");
  });

  it("should preserve the date through serialize and deserialize", () => {
    // Given
    const original = new TestModel(new Date("2023-01-01T00:00:00.000Z"));

    // When
    const plain = ClassConverter.serialize(original);
    const restored = ClassConverter.deserialize(plain, TestModel);

    // Then
    expect(restored.createdAt).toBeInstanceOf(Date);
    expect(restored.createdAt.toISOString()).toBe(original.createdAt.toISOString());
  });
});
