{
  "indexes": [
    {
      "collectionGroup": "kits",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "tags",
          "arrayConfig": "CONTAINS"
        },
        {
          "fieldPath": "favoritesCount",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "kits",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "tags",
          "arrayConfig": "CONTAINS"
        },
        {
          "fieldPath": "updated",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "kits",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "user",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updated",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "samples",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "name",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "favoritesCount",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "samples",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "name",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updated",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "samples",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "user",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updated",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
