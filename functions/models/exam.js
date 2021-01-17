const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    questions: {
        type: Object,
        required: true,
    },

    dueDate: {
        type: Date,
        required: true,
    },

    description: {
        type: String,
        default: ""
    },

    duration: {
        type: Number,
        required: true
    },

    isPublished: {
        type: Boolean,
        default: false
    },

    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    targetGroups: {
        type: Array,
        default: []
    },

    targetUsers: {
        type: Array,
        default: []
    }
    
});

const Exam = mongoose.model("Exam", ExamSchema, "exams");

module.exports = Exam;
