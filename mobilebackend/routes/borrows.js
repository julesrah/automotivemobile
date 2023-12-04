const { Borrow } = require("../models/borrow");
const { Tool } = require("../models/tool");
const express = require("express");
const { BorrowItem } = require("../models/borrow-item");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const borrowList = await Borrow.find()
    .populate("user", "name")
    .sort({ dateBorrowed: -1 });

  if (!borrowList) {
    res.status(500).json({ success: false });
  }

  res.status(201).json(borrowList);
});

router.get(`/:id`, async (req, res) => {
  const borrow = await Borrow.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "borrowItems",
      populate: {
        path: "tool",
        populate: "category",
      },
    });

  if (!borrow) {
    res.status(500).json({ success: false });
  }
  res.send(borrow);
});

router.post("/", async (req, res) => {
  const borrowItemsIds = Promise.all(
    req.body.borrowItems.map(async (borrowItem) => {
      console.log(req.body);
      let newBorrowItem = new BorrowItem({
        quantity: borrowItem.quantity,
        tool: borrowItem.id,
      });

      const tool = await Tool.findById(borrowItem.id);

      if (tool) {
        tool.countInStock -= borrowItem.quantity;
        await tool.save();
      }
      newBorrowItem = await newBorrowItem.save();

      return newBorrowItem._id;
    })
  );
  console.log(borrowItemsIds);
  const borrowItemsIdsResolved = await borrowItemsIds;
  console.log(borrowItemsIds);

  let borrow = new Borrow({
    borrowItems: borrowItemsIdsResolved,
    status: req.body.status,
    user: req.body.user,
    dateBorrowed: req.body.dateBorrowed,
  });
  borrow = await borrow.save();

  if (!borrow) return res.status(400).send("The borrow cannot be created!");

  res.send(borrow);
});

router.put("/:id", async (req, res) => {
  const borrow = await Borrow.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!borrow) return res.status(400).send("the Borrow cannot be update!");

  res.send(borrow);
});

router.delete("/:id", (req, res) => {
  Borrow.findByIdAndRemove(req.params.id)
    .then(async (borrow) => {
      if (borrow) {
        await borrow.borrowItems.map(async (borrowItem) => {
          await BorrowItem.findByIdAndRemove(borrowItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the borrow is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "borrow not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const borrowCount = await Borrow.countDocuments((borrow) => borrow);

  if (!borrowCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    borrowCount: borrowCount,
  });
});

router.get(`/get/userborrows/:userid`, async (req, res) => {
  const userBorrowList = await Borrow.find({ user: req.params.userid })
    .populate({
      path: "borrowItems",
      populate: {
        path: "tool",
        populate: "category",
      },
    })
    .sort({ dateBorrowed: -1 });

  if (!userBorrowList) {
    res.status(500).json({ success: false });
  }
  res.send(userBorrowList);
});

router.put("/update-status/:id", async (req, res) => {
    try {
      console.log(req.body.dateReturned);

      const updatedBorrow = await Borrow.findByIdAndUpdate(
        req.params.id,
        { 
          status: "Returned",
          dateReturned: Date()  // Include dateReturned in the update
        },
        { new: true }
      );
  
      if (!updatedBorrow) {
        return res
          .status(404)
          .json({ success: false, message: "Borrow not found" });
      }
  
      res.json(updatedBorrow);
    } catch (error) {
      console.error("Error updating borrow status:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });
  

module.exports = router;